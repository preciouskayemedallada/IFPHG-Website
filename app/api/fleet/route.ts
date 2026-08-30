import { NextResponse } from "next/server";

const IFPHG_ORGANIZATION_ID = "7d185e34-ad80-4362-8d4b-3f5671dda95a";
const FLEET_BASE_URL = `https://api.infiniteflight.com/persistence/v0/organizations/${IFPHG_ORGANIZATION_ID}`;

interface LivePosition {
  persistentAircraftId?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  speed?: number;
  groundSpeed?: number;
  lastReportUtc?: string;
  username?: string;
  callsign?: string;
}

interface ScheduleFlight {
  persistentAircraftId?: string;
  flightStatus?: number;
  sequence?: number;
  originICAO?: string;
  destinationICAO?: string;
}

interface AircraftInformation {
  maintenanceCompletionTimeUTC?: string;
  groundSpeed?: number;
  altitude?: number;
  parkingBrakeOn?: boolean;
  aircraftState?: number;
  pilotName?: string;
  location?: { latitude?: number; longitude?: number };
  currentETE?: string;
  type?: string;
  aircraftType?: string;
  name?: string;
}

interface AircraftItem {
  id?: string;
  registration?: string;
  scenario?: {
    sourceAirport?: string;
    destinationAirport?: string;
    flightPlanInfo?: { flightPlanItems?: FlightPlanWaypoint[] };
    localizedName?: { en?: string };
    name?: string;
    type?: string;
    aircraftType?: string;
  };
  aircraftInformation?: AircraftInformation;
  aircraftShortName?: string;
  aircraftName?: string;
  willBeBenched?: boolean;
  isFleetOverageParked?: boolean;
  isFleetActiveSlot?: boolean;
}

interface FlightPlanWaypoint {
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

function getAircraftState(
  aircraft: AircraftItem,
  positions: Map<string, LivePosition>
): string {
  const info = aircraft.aircraftInformation || {};

  if (!info.maintenanceCompletionTimeUTC && !aircraft.willBeBenched && !aircraft.isFleetOverageParked && Object.keys(info).length === 0) {
    return "Virtual Hangar";
  }

  if (aircraft.willBeBenched) return "Virtual Hangar";
  if (aircraft.isFleetOverageParked) return "Virtual Hangar";

  const maint = info.maintenanceCompletionTimeUTC;
  if (maint && maint !== "0001-01-01T00:00:00+00:00") {
    try {
      if (new Date(maint.replace("Z", "+00:00")) > new Date()) {
        return "Virtual Hangar";
      }
    } catch {
      // ignore parse errors
    }
  }

  const key = aircraft.id ? String(aircraft.id) : null;
  let position = key ? positions.get(key) : undefined;

  if (position) {
    try {
      const reportTime = new Date(position.lastReportUtc!.replace("Z", "+00:00"));
      if (Date.now() - reportTime.getTime() > 15 * 60 * 1000) {
        position = undefined;
      }
    } catch {
      // ignore
    }
  }

  if (position) {
    const speed = parseFloat(String(position.speed || position.groundSpeed || 0));
    const altitude = parseFloat(String(position.altitude || 0));

    if (speed > 35 && altitude > 300) {
      return "In Flight";
    }
    return "On Ground";
  }

  const aircraftState = info.aircraftState;
  if (aircraftState === 1) return "On Ground";
  if (aircraftState === 2) return "In Flight";
  if (aircraftState === 4) return "Stopped";

  const groundSpeed = parseFloat(String(info.groundSpeed || 0));
  const altitude = parseFloat(String(info.altitude || 0));
  const parkingBrake = info.parkingBrakeOn === true;

  if (parkingBrake && groundSpeed <= 2) return "Stopped";
  if (groundSpeed > 35 && altitude > 300) return "In Flight";
  if (groundSpeed > 0 || altitude > 0) return "On Ground";

  return "Stopped";
}

function getFleetStatus(aircraft: AircraftItem): string {
  if (aircraft.willBeBenched) return "Storage";
  if (aircraft.isFleetOverageParked) return "Storage";
  if (aircraft.isFleetActiveSlot === false) return "Storage";
  return "Active";
}

function getAircraftType(item: AircraftItem): string {
  const direct = item.aircraftShortName || item.aircraftName;
  if (direct && direct.trim()) return direct.trim();

  const info = item.aircraftInformation || {};
  const infoType = info.type || info.aircraftType || info.name;
  if (infoType && infoType.trim()) return infoType.trim();

  const scenario = item.scenario || {};
  const scenarioType = scenario.type || scenario.aircraftType;
  if (scenarioType && scenarioType.trim()) return scenarioType.trim();

  return "Unknown Aircraft";
}

function getCallsign(item: AircraftItem, position?: LivePosition): string | null {
  if (position?.callsign) return position.callsign;

  const scenario = item.scenario || {};
  const localized = scenario.localizedName || {};
  const rawName = localized.en || scenario.name || "";

  if (rawName.startsWith("IF Philippines Group")) {
    return rawName.replace("IF Philippines Group", "").trim() || null;
  }

  return rawName || null;
}

function extractArray(data: unknown): unknown[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data !== "object") return [];

  const obj = data as Record<string, unknown>;

  for (const key of ["result", "data", "airplanes", "aircraft", "items"]) {
    const value = obj[key];
    if (Array.isArray(value)) return value;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value && typeof value === "object") {
      const nested = extractArray(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

async function fetchWithAuth(url: string, token: string): Promise<Response> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "IFPHG-Website/1.0",
    },
    // Next.js API routes run on the server, so we can set a cache strategy
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "(no body)");
    console.error(`IF API error ${response.status}: ${url}`, text.slice(0, 500));
    throw new Error(`IF API returned ${response.status}`);
  }

  return response;
}

export async function GET() {
  try {
    const token = process.env.IF_ACCESS_TOKEN;
    if (!token) {
      console.error("IF_ACCESS_TOKEN is not configured");
      return NextResponse.json(
        { error: "Configuration error" },
        { status: 500 }
      );
    }

    const [aircraftRes, positionsRes, scheduleRes] = await Promise.all([
      fetchWithAuth(`${FLEET_BASE_URL}/aircraft`, token),
      fetchWithAuth(`${FLEET_BASE_URL}/aircraft/live-positions`, token),
      fetchWithAuth(`${FLEET_BASE_URL}/schedule`, token),
    ]);

    const aircraftData = await aircraftRes.json();
    const positionsData = await positionsRes.json();
    const scheduleData = await scheduleRes.json();

    const aircraftList: AircraftItem[] = extractArray(aircraftData) as AircraftItem[];

    const positionsList: LivePosition[] = extractArray(positionsData) as LivePosition[];

    const scheduleList: ScheduleFlight[] = extractArray(scheduleData) as ScheduleFlight[];

    const positionMap = new Map<string, LivePosition>();
    for (const pos of positionsList) {
      if (pos.persistentAircraftId) {
        positionMap.set(String(pos.persistentAircraftId), pos);
      }
    }

    const scheduleMap = new Map<string, ScheduleFlight>();
    const candidates: ScheduleFlight[] = [];
    for (const flight of scheduleList) {
      if (flight.persistentAircraftId && (flight.flightStatus === 0 || flight.flightStatus === 1)) {
        candidates.push(flight);
      }
    }
    candidates.sort((a, b) => (a.sequence || 999999) - (b.sequence || 999999));
    for (const flight of candidates) {
      const key = String(flight.persistentAircraftId);
      if (!scheduleMap.has(key)) {
        scheduleMap.set(key, flight);
      }
    }

    const result = aircraftList.map((aircraft) => {
      const info = aircraft.aircraftInformation || {};
      const position = positionMap.get(String(aircraft.id || ""));
      const schedule = scheduleMap.get(String(aircraft.id || ""));

      const state = getAircraftState(aircraft, positionMap);
      const fleetStatus = getFleetStatus(aircraft);

      let currentPilot: string | null = null;
      let lastUpdate: string | null = null;
      let location: { lat: number | null; lon: number | null } | null = null;
      let flightPlan: { from: string | null; to: string | null } | null = null;

      if (position) {
        currentPilot = position.username || null;
        lastUpdate = position.lastReportUtc || null;
        location = {
          lat: position.latitude ?? null,
          lon: position.longitude ?? null,
        };
      } else {
        const infoLoc = info.location || {};
        const infoLat = infoLoc.latitude ?? null;
        const infoLon = infoLoc.longitude ?? null;
        if (infoLat != null && infoLon != null) {
          location = { lat: infoLat, lon: infoLon };
        }
        if (info.pilotName) {
          currentPilot = info.pilotName;
        }
      }

      if (schedule) {
        flightPlan = {
          from: schedule.originICAO || null,
          to: schedule.destinationICAO || null,
        };
      } else if (aircraft.scenario) {
        const dep = aircraft.scenario.sourceAirport;
        const dest = aircraft.scenario.destinationAirport;
        if (dep || dest) {
          flightPlan = {
            from: dep || null,
            to: dest || null,
          };
        }
      }

      const registration = aircraft.registration || "Unknown";
      const aircraftType = getAircraftType(aircraft);
      const callsign = getCallsign(aircraft, position);

      let flightPlanWaypoints: { lat: number; lon: number }[] = [];
      const planItems = aircraft.scenario?.flightPlanInfo?.flightPlanItems;
      if (Array.isArray(planItems)) {
        for (const item of planItems) {
          if (!item || typeof item !== "object") continue;
          const loc = (item as FlightPlanWaypoint).location;
          if (!loc || typeof loc !== "object") continue;
          const lat = Number(loc.latitude);
          const lon = Number(loc.longitude);
          if (Number.isFinite(lat) && Number.isFinite(lon)) {
            flightPlanWaypoints.push({ lat, lon });
          }
        }
      }

      return {
        id: aircraft.id,
        registration,
        aircraftType,
        aircraftState: state,
        fleetStatus,
        currentPilot,
        lastUpdate,
        location,
        flightPlan,
        callsign,
        flightPlanWaypoints,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch fleet data:", error);
    return NextResponse.json(
      { error: "Failed to load fleet data" },
      { status: 502 }
    );
  }
}

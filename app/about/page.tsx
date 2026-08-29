import { Plane, Users, MessageCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/30 via-navy-900/80 to-navy-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-900/10 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

        <div className="container mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5 text-sm font-medium text-primary-300">
            <span className="text-base">🇵🇭</span>
            <span>Our Story</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            About IFPHG
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Welcome to the official group of Filipino and International Pilots of Infinite Flight.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="relative py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
              <div className="relative">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">Welcome to IFPHG</h2>
                <p className="mt-4 leading-relaxed text-slate-300">
                  Welcome new members to the official group of Filipino and International Pilots of Infinite Flight.
                  For all players of Infinite Flight gamers from the Philippines or the world!
                </p>
                <p className="mt-4 leading-relaxed text-slate-300">
                  Share your own experience about flying Boeings or Airbus and screenshots and videos of all your Infinite Flight experience.
                  Please do not post anything that is not Infinite Flight related. Those who will violate the rules will be removed from the group.
                  We welcome your suggestions and ideas.
                </p>
                <p className="mt-4 leading-relaxed text-slate-300">
                  We also have our very own Messenger groups for Off Topic and Unicom chats.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Our Fleets</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Infinite Flight: Philippine Fleet: Airbus A350-1000, Airbus A350-900, Airbus A321-200 Boeing 747-400, Boeing 777-300ER and MD-11 🇵🇭
              </p>
              <p className="mt-2 leading-relaxed text-slate-300">
                PAL Express: Dash 8 Q-400🇵🇭
              </p>
              <p className="mt-2 leading-relaxed text-slate-300">
                Cebu Pacific Fleet: Airbus A319 and A321-200
              </p>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Reminders</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                <li>WE FLY</li>
                <li>WE TALK</li>
                <li>WE TEACH</li>
                <li>WE CONQUER</li>
                <li>WE HAVE FUN</li>
                <li>WE ARE A TEAM</li>
                <li>WE ARE FILIPINOS</li>
                <li>WE RESPECT EACH OTHER</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Rules</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                <li>RACISM, SEXISM OR ANY DISRESPECTFUL COMMENTS IS NOT TOLERATED.</li>
                <li>ONE OFFICIAL FACEBOOK ACCOUNT ONLY.</li>
                <li>NO INTRODUCING ABOUT DOWNLOADING THE APP ILLEGALLY.</li>
                <li>NO PIRACY.</li>
                <li>NO TRASHTALK.</li>
                <li>NO PORN TOPICS</li>
                <li>NO POSTING VID/PIC IF IT IS NOT RELATED ABOUT THE GAME.</li>
                <li>CHANGE YOUR DISPLAY NAME INTO IFPHG THEN YOUR NAME.</li>
                <li>COOPERATE ON EVERY DISCUSSIONS.</li>
                <li>ENGLISH/TAGALOG LANGUAGE ONLY.</li>
                <li>PEOPLE WHO WILL USE FOUL WORDS WILL BE BANNED FOR ONE WEEK.</li>
                <li>NONSENSICAL POSTS WILL BE DELETED.</li>
                <li>PAPA ROMEO (PR) WILL BE THE PROPER CALLSIGN.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Group Chats</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
                <li>IFPHG - UNICOM</li>
                <li>IFPHG - OFF TOPIC</li>
                <li>IFPHG - Elite Group Chat</li>
                <li>IFPHG INTL UNICOM (For our int'l and local members) (English only)</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Social Media</h2>
              <p className="mt-4 leading-relaxed text-slate-300">
                Twitter: @IFPHGOfficial
              </p>
              <p className="mt-2 leading-relaxed text-slate-300">
                Instagram: @ifphgofficial
              </p>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 backdrop-blur-sm md:p-12">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Group Staffs</h2>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">Founder of IFPHG / Social Media Director</h3>
                  <p className="text-slate-300">Captain Nuel Usher</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Admins</h3>
                  <p className="text-slate-300">Captain Zypheir Roland Garcia (Retired)</p>
                  <p className="text-slate-300">Captain Jonas Macapagal (Retired)</p>
                  <p className="text-slate-300">Captain RV Terrenal (Retired)</p>
                  <p className="text-slate-300">Captain Daniel Jacob (Retired)</p>
                  <p className="text-slate-300">Captain Mohamed Zimnaan</p>
                  <p className="text-slate-300">Captain Yshy Sierra (Retired)</p>
                  <p className="text-slate-300">Captain Ken Pasaporte (Retired)</p>
                  <p className="text-slate-300">Captain Klive Feliciano (Retired)</p>
                  <p className="text-slate-300">Captain John Peter Lo</p>
                  <p className="text-slate-300">Captain Jean Carl Kenneth Li</p>
                  <p className="text-slate-300">Captain Rafael Reyes</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">FB Moderators</h3>
                  <p className="text-slate-300">Captain Raynear Monteverde</p>
                  <p className="text-slate-300">Captain John Anthony Cafe</p>
                  <p className="text-slate-300">Captain Karlo Angelo Soriano</p>
                  <p className="text-slate-300">Captain Luis Bugtong</p>
                  <p className="text-slate-300">Captain Andy Lugod</p>
                  <p className="text-slate-300">Captain Byron Balagtas</p>
                  <p className="text-slate-300">Captain Ron Bautista</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Callsign Manager</h3>
                  <p className="text-slate-300">Captain Rafael Reyes</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Recruitment Team</h3>
                  <p className="text-slate-300">Captain John Anthony Cafe</p>
                  <p className="text-slate-300">Captain Raynear Monteverde</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Event Moderators</h3>
                  <p className="text-slate-300">Captain John Peter Lo</p>
                  <p className="text-slate-300">Captain Rafael Reyes Yebra</p>
                  <p className="text-slate-300">Captain Schaeffer Lewis</p>
                  <p className="text-slate-300">Captain Jean Carl Kenneth</p>
                  <p className="text-slate-300">Captain Raynear Monteverde</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Website Creator</h3>
                  <p className="text-slate-300">Captain RV Terrenal</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">IFPHG - PAF</h3>
                  <p className="text-slate-300">Capt. Jonas Macapagal</p>
                  <p className="text-slate-300">Capt. Luis Bugtong</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Special Adviser of IFPHG</h3>
                  <p className="text-slate-300">Captain Erwin Tejano PR001</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-8 text-center backdrop-blur-sm md:p-12">
              <p className="text-lg font-semibold text-white">"Pilots take no special joy in walking, pilots like flying."</p>
              <p className="mt-4 text-slate-300">Visit our Instagram Account @ifphgoffficial</p>
              <p className="mt-2 text-2xl">✈️🇵🇭 Pilipinas/Philippines 🇵🇭✈️</p>
              <p className="mt-2 text-xl font-bold text-primary-400">🇵🇭 It's more fun in IFPHG 🇵🇭</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

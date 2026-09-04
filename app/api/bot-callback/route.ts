import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const ifError = url.searchParams.get("error");

  if (!code || ifError) {
    return NextResponse.redirect(
      new URL("/login?error=cancelled", process.env.NEXTAUTH_URL || request.url),
    );
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IFPHG Bot OAuth</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0b0f19;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 560px;
      background: #111827;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
    }
    h1 { margin: 0 0 8px; font-size: 20px; }
    p { margin: 0 0 16px; color: #94a3b8; font-size: 14px; }
    .label { font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
    .code {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 13px;
      color: #f8fafc;
      word-break: break-all;
      user-select: all;
    }
    .copy {
      margin-top: 12px;
      width: 100%;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #334155;
      background: #1e293b;
      color: #e2e8f0;
      cursor: pointer;
      font-size: 14px;
    }
    .copy:hover { background: #334155; }
    .notice {
      margin-top: 14px;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>IFPHG Bot Authorization</h1>
    <p>Copy the code below and paste it into the Discord /if-auth flow.</p>
    <div class="label">Authorization Code</div>
    <div class="code" id="code">${code}</div>
    <button class="copy" id="copy">Copy Code</button>
    <div class="notice">Do not share this code publicly. It can be used once to complete the bot OAuth flow.</div>
  </div>
  <script>
    const codeEl = document.getElementById("code");
    const copyBtn = document.getElementById("copy");
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(codeEl.textContent || "");
        copyBtn.textContent = "Copied";
        setTimeout(() => { copyBtn.textContent = "Copy Code"; }, 1500);
      } catch {
        copyBtn.textContent = "Copy failed";
      }
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

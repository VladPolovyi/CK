// app/api/rebuild/route.ts  (Next.js App Router example)
export async function GET() {
    const res = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL!, { method: "POST" });
    if (!res.ok) {
      return new Response(`Failed: ${res.status}`, { status: 500 });
    }
    return new Response("Triggered redeploy", { status: 200 });
  }
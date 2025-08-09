export async function GET() {
  return Response.json({
    message: 'Hello from Vercel Functions',
    time: new Date().toISOString(),
  })
}

// To run this as an Edge Function instead of Node.js Serverless, uncomment:
// export const runtime = 'edge'



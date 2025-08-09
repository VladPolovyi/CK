import { blizzardGet } from '@/lib/blizzard'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = (searchParams.get('region') || 'eu') as 'us' | 'eu' | 'kr' | 'tw' | 'cn'
  const path = searchParams.get('path') || '/wow/guild/ravencrest/cbitahok-kpobi/roster'

  // Forward all other search params to Blizzard
  const forwardParams: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'region' && key !== 'path') forwardParams[key] = value
  })

  try {
    const res = await blizzardGet(region, path, forwardParams)
    const body = await res.text()
    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}



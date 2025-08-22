import { getPvpTitlesSummary } from '@/lib/pvp-titles'

export const revalidate = 86400

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const region = (searchParams.get('region') || 'eu') as 'us' | 'eu' | 'kr' | 'tw' | 'cn'
  const realm = (searchParams.get('realm') || 'ravencrest').toLowerCase()
  const name = (searchParams.get('name') || '').toLowerCase()
  if (!name) return Response.json({ error: 'Missing name' }, { status: 400 })

  try {
    const summary = await getPvpTitlesSummary(region, realm, name)
    return Response.json(summary, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}



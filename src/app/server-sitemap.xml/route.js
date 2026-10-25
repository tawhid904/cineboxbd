import { getServerSideSitemap } from 'next-sitemap'

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY
  const [moviesRes, tvRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`),
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=1`),
  ])
  const [moviesData, tvData] = await Promise.all([moviesRes.json(), tvRes.json()])
  const now = new Date().toISOString()
  const urls = [
    ...(moviesData.results || []).map((m) => ({
      loc: `https://www.cineboxbd.bond/movies/${m.id}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8,
    })),
    ...(tvData.results || []).map((s) => ({
      loc: `https://www.cineboxbd.bond/tv/${s.id}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8,
    })),
  ]
  return getServerSideSitemap(urls)
}

// עוטף דק סביב fetch. הבקשות עוברות דרך ה-proxy של Vite (/api -> backend).
const BASE_URL = '/api'

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `שגיאת שרת (${res.status})`)
  }

  // 204 No Content (למשל אחרי DELETE) — אין גוף להחזיר
  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

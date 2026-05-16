export async function apiFetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Request failed: ${url}`)
  }
  return data as T
}

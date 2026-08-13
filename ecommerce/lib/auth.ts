export function getSafeRedirect(value: string | null | undefined): string {
  if (!value) return "/"
  if (!value.startsWith("/") || value.startsWith("//")) return "/"
  if (value.startsWith("/login") || value.startsWith("/register")) return "/"
  return value
}

export function loginPath(redirect?: string | null): string {
  const target = getSafeRedirect(redirect)
  if (target === "/") return "/login"
  return `/login?redirect=${encodeURIComponent(target)}`
}

export function orderStatusLabel(status?: string): string {
  const map: Record<string, string> = {
    paid: "Đã thanh toán",
    pending: "Đang xử lý",
    shipped: "Đang giao",
    cancelled: "Đã hủy",
  }
  return map[status || ""] || status || "Đang xử lý"
}

// Thin wrapper around GA4's native gtag browser global.
// Optional chaining ensures no-op when gtag is unavailable (tests, ad blockers).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackPageView(path: string, title: string): void {
  window.gtag?.('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: title,
  })
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  window.gtag?.('event', eventName, params)
}

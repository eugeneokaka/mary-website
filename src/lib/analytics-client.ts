const VIEWER_ID_KEY = "oasis.viewerId";
const VIEWED_SESSION_PREFIX = "oasis.viewed.";

export const DATE_PRESETS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
] as const;

export type DatePreset = (typeof DATE_PRESETS)[number]["value"];
export type RangePreset = DatePreset | "custom";

const DAY_MS = 24 * 60 * 60 * 1000;

export function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayKey(): string {
  return toDayKey(new Date());
}

export function rangeForPreset(preset: DatePreset): { fromDay: string; toDay: string } {
  const toDay = todayKey();
  if (preset === "all") {
    return { fromDay: "2020-01-01", toDay };
  }

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const from = new Date(Date.now() - (days - 1) * DAY_MS);
  return { fromDay: toDayKey(from), toDay };
}

// Stable anonymous id used to count unique readers. No personal data stored.
export function getViewerId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(VIEWER_ID_KEY);
    if (existing) return existing;

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VIEWER_ID_KEY, id);
    return id;
  } catch {
    return null;
  }
}

// Returns true the first time this article is opened in the current session.
export function claimViewInSession(postId: string): boolean {
  try {
    const key = `${VIEWED_SESSION_PREFIX}${postId}`;
    if (window.sessionStorage.getItem(key)) return false;
    window.sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

export function isBot(): boolean {
  if (typeof navigator === "undefined") return true;
  if (navigator.webdriver) return true;
  return /bot|crawl|spider|slurp|headless|preview|lighthouse|pingdom/i.test(
    navigator.userAgent,
  );
}

export function buildDownloadHref(storageId: string, name: string): string {
  const base = (process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? "").replace(/\/+$/, "");
  return `${base}/download?id=${storageId}&name=${encodeURIComponent(name)}`;
}

// Tags attachment links with the article id so the download route can count them.
export function withPostId(href: string | null | undefined, postId: string): string | null {
  if (!href) return null;

  try {
    const url = new URL(href);
    if (!url.pathname.endsWith("/download")) return href;
    url.searchParams.set("postId", postId);
    return url.toString();
  } catch {
    return href;
  }
}

export function formatReadTime(ms: number): string {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}

export function formatDayLabel(day: string): string {
  const date = new Date(`${day}T00:00:00.000Z`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

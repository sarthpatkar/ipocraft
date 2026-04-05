export const CANONICAL_ORIGIN = "https://ipocraft.com";

function normalizePathname(pathname: string) {
  const compact = pathname.replace(/\/{2,}/g, "/");

  if (compact === "/" || compact === "") {
    return "/";
  }

  return compact.replace(/\/+$/, "") || "/";
}

export function canonicalUrl(path = "/") {
  const url = new URL(path, `${CANONICAL_ORIGIN}/`);
  const pathname = normalizePathname(url.pathname);

  if (pathname === "/") {
    return CANONICAL_ORIGIN;
  }

  return `${CANONICAL_ORIGIN}${pathname}`;
}

export function normalizeUrlForComparison(url: string) {
  const parsed = new URL(url);
  return canonicalUrl(parsed.pathname);
}

export function isCanonicalUrl(url: string) {
  try {
    return normalizeUrlForComparison(url) === canonicalUrl(new URL(url).pathname);
  } catch {
    return false;
  }
}

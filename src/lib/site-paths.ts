const githubProjectBase = "/assiatour.github.io/";

export function getSiteBasePath() {
  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return githubProjectBase;
  }
  return "/";
}

export function getRouterBaseName() {
  return getSiteBasePath().replace(/\/$/, "");
}

export function assetPath(path: string) {
  return `${getSiteBasePath()}${path.replace(/^\//, "")}`;
}

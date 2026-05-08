import { APP_VERSION, APP_REPO_URL } from './appInfo';

/**
 * @returns {{ owner: string, repo: string } | null}
 */
export function parseGithubRepo() {
  const m = String(APP_REPO_URL).match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

/** @param {string} v */
export function normalizeVersionTag(v) {
  return String(v || '')
    .replace(/^v/i, '')
    .replace(/\+.*$/, '')
    .trim();
}

/** @param {string} v */
function semverTuple(v) {
  const core = normalizeVersionTag(v).split('-')[0];
  const parts = core.split('.').map((x) => parseInt(x, 10));
  const maj = Number.isFinite(parts[0]) ? parts[0] : 0;
  const min = Number.isFinite(parts[1]) ? parts[1] : 0;
  const pat = Number.isFinite(parts[2]) ? parts[2] : 0;
  return [maj, min, pat];
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number} 1 if a > b, -1 if a < b, 0 if equal
 */
export function compareSemver(a, b) {
  const A = semverTuple(a);
  const B = semverTuple(b);
  for (let i = 0; i < 3; i += 1) {
    if (A[i] !== B[i]) return A[i] > B[i] ? 1 : -1;
  }
  return 0;
}

/**
 * @typedef {{
 *   ok: boolean,
 *   currentVersion: string,
 *   remoteVersion: string | null,
 *   isNewer: boolean,
 *   releaseUrl: string | null,
 *   htmlUrl: string | null,
 *   name: string | null,
 *   publishedAt: string | null,
 *   errorMessage?: string,
 * }} UpdateCheckResult
 */

/** @returns {Promise<UpdateCheckResult>} */
export async function checkForUpdates() {
  const currentVersion = APP_VERSION;
  const slug = parseGithubRepo();
  if (!slug) {
    return {
      ok: false,
      currentVersion,
      remoteVersion: null,
      isNewer: false,
      releaseUrl: null,
      htmlUrl: null,
      name: null,
      publishedAt: null,
      errorMessage: 'This build does not have a GitHub repository URL configured.',
    };
  }

  const apiUrl = `https://api.github.com/repos/${slug.owner}/${slug.repo}/releases/latest`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': `TimeTracker/${currentVersion}`,
      },
    });

    if (res.status === 404) {
      return {
        ok: true,
        currentVersion,
        remoteVersion: null,
        isNewer: false,
        releaseUrl: `${APP_REPO_URL}/releases`,
        htmlUrl: null,
        name: null,
        publishedAt: null,
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        currentVersion,
        remoteVersion: null,
        isNewer: false,
        releaseUrl: `${APP_REPO_URL}/releases`,
        htmlUrl: null,
        name: null,
        publishedAt: null,
        errorMessage: `Could not reach GitHub (HTTP ${res.status}).`,
      };
    }

    const data = await res.json();
    const tag = normalizeVersionTag(data.tag_name);
    const cmp = compareSemver(tag, currentVersion);

    return {
      ok: true,
      currentVersion,
      remoteVersion: tag,
      isNewer: cmp > 0,
      releaseUrl: data.html_url || `${APP_REPO_URL}/releases`,
      htmlUrl: data.html_url || null,
      name: data.name || tag,
      publishedAt: data.published_at || null,
    };
  } catch (err) {
    return {
      ok: false,
      currentVersion,
      remoteVersion: null,
      isNewer: false,
      releaseUrl: `${APP_REPO_URL}/releases`,
      htmlUrl: null,
      name: null,
      publishedAt: null,
      errorMessage: err?.message || 'Network error while checking for updates.',
    };
  }
}

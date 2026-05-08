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

/**
 * Public Atom feed — works when api.github.com returns 403 (browser / anonymous API blocks).
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<{ ok: true, tag: string, htmlUrl: string | null, name: string | null, publishedAt: string | null } | { ok: false, errorMessage: string }>}
 */
async function fetchLatestReleaseViaAtom(owner, repo) {
  const atomUrl = `https://github.com/${owner}/${repo}/releases.atom`;
  try {
    const res = await fetch(atomUrl);
    if (!res.ok) {
      return { ok: false, errorMessage: `Releases feed HTTP ${res.status}` };
    }
    const xml = await res.text();
    const firstEntry = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!firstEntry) {
      return { ok: false, errorMessage: 'No releases found in GitHub feed.' };
    }
    const block = firstEntry[1];
    const titleMatch = block.match(/<title>([^<]*)<\/title>/);
    const linkMatch =
      block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/) ||
      block.match(/<link[^>]*href="([^"]+)"[^>]*rel="alternate"/);
    const updatedMatch = block.match(/<updated>([^<]+)<\/updated>/);
    const rawTitle = titleMatch?.[1]?.trim() || '';
    const tag = normalizeVersionTag(rawTitle);
    if (!tag) {
      return { ok: false, errorMessage: 'Could not parse release version from feed.' };
    }
    return {
      ok: true,
      tag,
      htmlUrl: linkMatch?.[1] || null,
      name: rawTitle || tag,
      publishedAt: updatedMatch?.[1] || null,
    };
  } catch (e) {
    return { ok: false, errorMessage: e?.message || 'Failed to load releases feed.' };
  }
}

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
        'X-GitHub-Api-Version': '2022-11-28',
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

    /** @type {string | null} */
    let tag = null;
    /** @type {string | null} */
    let htmlUrl = null;
    /** @type {string | null} */
    let name = null;
    /** @type {string | null} */
    let publishedAt = null;

    if (res.ok) {
      const data = await res.json();
      tag = normalizeVersionTag(data.tag_name);
      htmlUrl = data.html_url || null;
      name = data.name || tag;
      publishedAt = data.published_at || null;
    } else {
      const atom = await fetchLatestReleaseViaAtom(slug.owner, slug.repo);
      if (!atom.ok) {
        return {
          ok: false,
          currentVersion,
          remoteVersion: null,
          isNewer: false,
          releaseUrl: `${APP_REPO_URL}/releases`,
          htmlUrl: null,
          name: null,
          publishedAt: null,
          errorMessage:
            res.status === 403 || res.status === 429
              ? `GitHub API blocked this request (HTTP ${res.status}). Try again later or open Releases below.`
              : `Could not reach GitHub (HTTP ${res.status}).`,
        };
      }
      tag = atom.tag;
      htmlUrl = atom.htmlUrl;
      name = atom.name;
      publishedAt = atom.publishedAt;
    }

    const cmp = compareSemver(tag, currentVersion);

    return {
      ok: true,
      currentVersion,
      remoteVersion: tag,
      isNewer: cmp > 0,
      releaseUrl: htmlUrl || `${APP_REPO_URL}/releases`,
      htmlUrl,
      name: name || tag,
      publishedAt,
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

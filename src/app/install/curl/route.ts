import { siteConfig } from '@/config/site.config';

/**
 * GET /install/curl — POSIX install script (macOS, Linux, Git Bash).
 * Served as text/plain so `curl … | bash` works.
 *
 * Installs the EngCode CLI from npm (the one real distribution channel —
 * there are no native binaries or installers yet). Requires Node.js 20+.
 */

const script = `#!/usr/bin/env bash
# EngCode installer — ${siteConfig.url}
# Usage: curl ${siteConfig.url}/install/curl -fsS | bash
#
# Options (as env vars):
#   ENGCODE_VERSION=1.0.0   install a specific version
#   ENGCODE_PREFIX=/dir     install into a custom prefix instead of npm -g
set -euo pipefail

VERSION="\${ENGCODE_VERSION:-latest}"
PREFIX="\${ENGCODE_PREFIX:-}"

info() { printf '\\033[36m==> %s\\033[0m\\n' "$1"; }
ok()   { printf '\\033[32m%s\\033[0m\\n' "$1"; }
fail() { printf '\\033[31m%s\\033[0m\\n' "$1" >&2; exit 1; }

echo "EngCode - Build with Simple English"
echo

command -v node >/dev/null 2>&1 || fail "Node.js 20+ is required. Install it from https://nodejs.org/ and re-run."
command -v npm >/dev/null 2>&1 || fail "npm is required. Install Node.js from https://nodejs.org/ and re-run."

NODE_VERSION="$(node --version | sed 's/^v//')"
NODE_MAJOR="$(printf '%s' "$NODE_VERSION" | cut -d. -f1)"
[ "$NODE_MAJOR" -ge 20 ] || fail "EngCode needs Node.js 20 or newer. This machine has $NODE_VERSION."

NPM="npm"
command -v npm >/dev/null 2>&1 || NPM="npm.cmd"

if [ -n "$PREFIX" ]; then
  if [ "$VERSION" = "latest" ]; then
    info "Installing the latest EngCode into $PREFIX"
    "$NPM" install -g --prefix "$PREFIX" engcode
  else
    info "Installing EngCode $VERSION into $PREFIX"
    "$NPM" install -g --prefix "$PREFIX" "engcode@$VERSION"
  fi
  # Find the launcher
  LAUNCHER=""
  for CAND in "$PREFIX/bin/engcode" "$PREFIX/engcode"; do
    [ -x "$CAND" ] && LAUNCHER="$CAND" && break
  done
  [ -n "$LAUNCHER" ] || fail "The install finished, but no engcode launcher was found under $PREFIX."
  "$LAUNCHER" --version
  echo
  echo "Add $PREFIX/bin to your PATH to run 'engcode' anywhere."
else
  if [ "$VERSION" = "latest" ]; then
    info "Installing the latest EngCode from npm"
    "$NPM" install -g engcode
  else
    info "Installing EngCode $VERSION from npm"
    "$NPM" install -g "engcode@$VERSION"
  fi
  echo
  info "Checking the command"
  if ! command -v engcode >/dev/null 2>&1; then
    fail "The install finished, but 'engcode' is not on PATH yet. Open a new terminal, or add npm's global bin folder to PATH."
  fi
  engcode --version
fi

echo
ok "EngCode is ready."
echo "Try:"
echo "  engcode learn"
echo "  engcode new my-project --type script"
echo "  engcode run my-project/main.eng"
echo
echo "The short form 'eng' works everywhere 'engcode' does."
`;

export function GET() {
  return new Response(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

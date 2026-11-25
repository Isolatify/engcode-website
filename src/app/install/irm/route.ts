import { siteConfig } from '@/config/site.config';

/**
 * GET /install/irm — Windows PowerShell install script.
 * Served as text/plain so `irm … | iex` works.
 *
 * Installs the EngCode CLI from npm (the one real distribution channel —
 * there are no native binaries or installers yet). Requires Node.js 20+.
 */

const script = `# EngCode installer — ${siteConfig.url}
# Usage: irm '${siteConfig.url}/install/irm' | iex
#
# Options (as env vars):
#   $env:ENGCODE_VERSION = '1.0.0'   install a specific version
#   $env:ENGCODE_PREFIX  = 'C:\\dir'  install into a custom prefix
#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

$Version = if ($env:ENGCODE_VERSION) { $env:ENGCODE_VERSION } else { 'latest' }
$Prefix  = if ($env:ENGCODE_PREFIX) { $env:ENGCODE_PREFIX } else { '' }

function Write-Info([string]$Message) { Write-Host $Message -ForegroundColor Cyan }
function Write-Ok([string]$Message)   { Write-Host $Message -ForegroundColor Green }
function Fail([string]$Message)       { Write-Host $Message -ForegroundColor Red; exit 1 }

Write-Host "EngCode - Build with Simple English" -ForegroundColor Magenta
Write-Host ""

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npm) { $npm = Get-Command npm -ErrorAction SilentlyContinue }
if (-not $npm) {
  Fail "Node.js 20+ is required. Install it from https://nodejs.org/ and re-run."
}

$nodeVersion = (& node --version).TrimStart("v")
$major = [int]($nodeVersion.Split(".")[0])
if ($major -lt 20) {
  Fail "EngCode needs Node.js 20 or newer. This machine has $nodeVersion."
}

if ($Prefix -ne '') {
  if ($Version -eq 'latest') {
    Write-Info "Installing the latest EngCode into $Prefix"
    & $npm install -g --prefix $Prefix engcode
  } else {
    Write-Info "Installing EngCode $Version into $Prefix"
    & $npm install -g --prefix $Prefix "engcode@$Version"
  }
  if ($LASTEXITCODE -ne 0) { Fail "The install did not finish. Check the messages above." }
  $launcher = Join-Path $Prefix "engcode.cmd"
  if (-not (Test-Path $launcher)) { Fail "The install finished, but $launcher was not found." }
  & $launcher --version
  Write-Host ""
  Write-Host "Add $Prefix to your PATH to run 'engcode' anywhere." -ForegroundColor Yellow
} else {
  if ($Version -eq 'latest') {
    Write-Info "Installing the latest EngCode from npm"
    & $npm install -g engcode
  } else {
    Write-Info "Installing EngCode $Version from npm"
    & $npm install -g "engcode@$Version"
  }
  if ($LASTEXITCODE -ne 0) { Fail "The install did not finish. Check the messages above." }
  Write-Info "Checking the command"
  if (-not (Get-Command engcode -ErrorAction SilentlyContinue)) {
    Fail "The install finished, but 'engcode' is not on PATH yet. Open a new terminal, or add npm's global bin folder to PATH."
  }
  & engcode --version
}

Write-Host ""
Write-Ok "EngCode is ready."
Write-Host "Try:"
Write-Host "  engcode learn"
Write-Host "  engcode new my-project --type script"
Write-Host "  engcode run my-project/main.eng"
Write-Host ""
Write-Host "The short form 'eng' works everywhere 'engcode' does."
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

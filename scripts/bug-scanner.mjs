#!/usr/bin/env node
/**
 * 🔍 BuscaTours Bug Scanner
 * Comprehensive static analysis + runtime check suite
 * Run: node scripts/bug-scanner.mjs
 */

import { execSync, spawnSync } from 'child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');

// ─── ANSI colors ──────────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold:  '\x1b[1m',
  dim:   '\x1b[2m',
  red:   '\x1b[31m',
  green: '\x1b[32m',
  yellow:'\x1b[33m',
  blue:  '\x1b[34m',
  cyan:  '\x1b[36m',
  magenta:'\x1b[35m',
  bgRed: '\x1b[41m',
  bgGreen:'\x1b[42m',
};
const col = (c, s) => `${c}${s}${C.reset}`;
const red    = s => col(C.red + C.bold, s);
const green  = s => col(C.green + C.bold, s);
const yellow = s => col(C.yellow + C.bold, s);
const cyan   = s => col(C.cyan, s);
const dim    = s => col(C.dim, s);
const bold   = s => col(C.bold, s);
const magenta= s => col(C.magenta + C.bold, s);

// ─── Counters ─────────────────────────────────────────────────────────────────
const results = { errors: 0, warnings: 0, info: 0, passed: 0 };
const allIssues = [];

function printHeader() {
  const width = 60;
  const line  = '═'.repeat(width);
  console.log('\n' + col(C.cyan + C.bold, `╔${line}╗`));
  console.log(col(C.cyan + C.bold, `║`) + col(C.bold, '          🔍  BuscaTours Bug Scanner v2.0          ') + col(C.cyan + C.bold, `║`));
  console.log(col(C.cyan + C.bold, `╚${line}╝`) + '\n');
}

function sectionHeader(title, icon = '📋') {
  console.log('\n' + col(C.blue + C.bold, `┌─ ${icon}  ${title} ${'─'.repeat(Math.max(0, 48 - title.length))}┐`));
}

function sectionEnd() {
  console.log(col(C.blue + C.bold, '└' + '─'.repeat(56) + '┘'));
}

function log(level, msg, file = '') {
  const prefix = {
    error:   red('  ✗ ERROR  '),
    warn:    yellow('  ⚠ WARN   '),
    info:    cyan('  ℹ INFO   '),
    pass:    green('  ✓ PASS   '),
  }[level] ?? '  · ';
  const filePart = file ? dim(` [${file}]`) : '';
  console.log(`${prefix}${msg}${filePart}`);
  if (level === 'error')  { results.errors++;   allIssues.push({ level, msg, file }); }
  if (level === 'warn')   { results.warnings++;  allIssues.push({ level, msg, file }); }
  if (level === 'info')   { results.info++; }
  if (level === 'pass')   { results.passed++; }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx'], found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir)) {
    if (['node_modules', 'dist', '.git', 'dataconnect-generated'].includes(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) getAllFiles(full, exts, found);
    else if (exts.includes(extname(entry))) found.push(full);
  }
  return found;
}

function shortPath(full) {
  return relative(ROOT, full).replace(/\\/g, '/');
}

function runCmd(cmd, cwd = ROOT) {
  try {
    return { ok: true, output: execSync(cmd, { cwd, encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }) };
  } catch (e) {
    return { ok: false, output: (e.stdout || '') + (e.stderr || '') };
  }
}

// ─── CHECK 1: TypeScript ──────────────────────────────────────────────────────
function checkTypeScript() {
  sectionHeader('TypeScript Type Errors', '🔷');
  const tsconfig = join(ROOT, 'tsconfig.json');
  if (!existsSync(tsconfig)) {
    // try tsc anyway with loose flags for JSX/JS mixed project
    const r = runCmd('npx tsc --noEmit --allowJs --checkJs --jsx react --target ES2020 --moduleResolution bundler --allowImportingTsExtensions 2>&1', ROOT);
    if (!r.ok) {
      const lines = r.output.split('\n').filter(l => l.includes('error TS'));
      if (lines.length === 0) {
        log('pass', 'No TypeScript errors (no tsconfig, loose mode)');
      } else {
        lines.slice(0, 20).forEach(l => log('error', l.trim()));
        if (lines.length > 20) log('warn', `… and ${lines.length - 20} more TS errors`);
      }
    } else {
      log('pass', 'TypeScript check passed');
    }
  } else {
    const r = runCmd('npx tsc --noEmit 2>&1');
    if (!r.ok) {
      const lines = r.output.split('\n').filter(l => l.includes('error TS'));
      if (lines.length === 0) {
        log('pass', 'No TypeScript errors');
      } else {
        lines.slice(0, 20).forEach(l => log('error', l.trim()));
        if (lines.length > 20) log('warn', `… and ${lines.length - 20} more TS errors`);
      }
    } else {
      log('pass', 'TypeScript: no type errors found');
    }
  }
  sectionEnd();
}

// ─── CHECK 2: ESLint ──────────────────────────────────────────────────────────
function checkESLint() {
  sectionHeader('ESLint Analysis', '🔍');
  const r = runCmd('npx eslint src --ext .js,.jsx,.ts,.tsx --format json --parser-options="requireConfigFile:false" 2>&1');
  try {
    // find JSON array in output
    const jsonStart = r.output.indexOf('[');
    if (jsonStart === -1) {
      log('warn', 'ESLint output not parseable. Raw: ' + r.output.slice(0, 200));
      sectionEnd();
      return;
    }
    const json = JSON.parse(r.output.slice(jsonStart));
    let totalErrors = 0, totalWarnings = 0;
    for (const file of json) {
      const rel = shortPath(file.filePath);
      for (const msg of file.messages) {
        const level = msg.severity === 2 ? 'error' : 'warn';
        log(level, `${msg.ruleId ?? 'no-rule'}: ${msg.message} (line ${msg.line})`, rel);
        if (msg.severity === 2) totalErrors++;
        else totalWarnings++;
      }
    }
    if (totalErrors === 0 && totalWarnings === 0) log('pass', 'ESLint: no issues found');
  } catch {
    // fallback: parse text output
    const lines = r.output.split('\n').filter(l => /error|warning/.test(l));
    if (lines.length === 0) log('pass', 'ESLint: no issues detected');
    else lines.slice(0, 30).forEach(l => log('warn', l.trim()));
  }
  sectionEnd();
}

// ─── CHECK 3: Console.log leaks ───────────────────────────────────────────────
function checkConsoleLogs() {
  sectionHeader('Console.log / Debugger Leaks', '🚰');
  const files = getAllFiles(SRC);
  const patterns = [
    { re: /console\.log\s*\(/g,   label: 'console.log' },
    { re: /console\.warn\s*\(/g,  label: 'console.warn (non-prod)' },
    { re: /debugger\s*;?/g,       label: 'debugger statement' },
    { re: /console\.error\s*\(/g, label: 'console.error' },
  ];
  let found = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      for (const { re, label } of patterns) {
        re.lastIndex = 0;
        if (re.test(line) && !line.trim().startsWith('//')) {
          log('warn', `${label} at line ${i + 1}: ${line.trim().slice(0, 80)}`, shortPath(f));
          found++;
        }
      }
    });
  }
  if (found === 0) log('pass', 'No console.log / debugger leaks found');
  sectionEnd();
}

// ─── CHECK 4: TODO / FIXME / HACK ─────────────────────────────────────────────
function checkTodoFixme() {
  sectionHeader('TODO / FIXME / HACK / XXX Comments', '📝');
  const files = getAllFiles(SRC);
  const re = /\b(TODO|FIXME|HACK|XXX|BUG|TEMP)\b/gi;
  let found = 0;
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      re.lastIndex = 0;
      const m = line.match(re);
      if (m) {
        log('info', `${m[0].toUpperCase()} at line ${i + 1}: ${line.trim().slice(0, 100)}`, shortPath(f));
        found++;
      }
    });
  }
  if (found === 0) log('pass', 'No TODO/FIXME/HACK markers found');
  sectionEnd();
}

// ─── CHECK 5: Missing/broken imports ──────────────────────────────────────────
function checkImports() {
  sectionHeader('Import Sanity Check', '📦');
  const files = getAllFiles(SRC);
  const importRe = /^import\s+.*?from\s+['"](.+?)['"]/gm;
  let issues = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    let m;
    while ((m = importRe.exec(src)) !== null) {
      const mod = m[1];
      // only check relative imports
      if (!mod.startsWith('.')) continue;
      const dir = join(f, '..');
      const exts = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
      const resolved = exts.map(e => join(dir, mod + e));
      if (!resolved.some(r => existsSync(r))) {
        log('error', `Broken import '${mod}' not resolved`, shortPath(f));
        issues++;
      }
    }
  }
  if (issues === 0) log('pass', 'All relative imports resolve correctly');
  sectionEnd();
}

// ─── CHECK 6: Large files ─────────────────────────────────────────────────────
function checkLargeFiles() {
  sectionHeader('Oversized Source Files', '📏');
  const files = getAllFiles(SRC);
  const WARN_LINES = 500;
  const ERROR_LINES = 1000;
  let found = 0;
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split('\n').length;
    if (lines > ERROR_LINES) {
      log('error', `${lines} lines — severely oversized (consider splitting)`, shortPath(f));
      found++;
    } else if (lines > WARN_LINES) {
      log('warn', `${lines} lines — consider refactoring`, shortPath(f));
      found++;
    }
  }
  if (found === 0) log('pass', 'All files within reasonable size');
  sectionEnd();
}

// ─── CHECK 7: Hardcoded secrets / keys ────────────────────────────────────────
function checkSecrets() {
  sectionHeader('Hardcoded Secrets / API Keys', '🔐');
  const files = getAllFiles(SRC);
  // also check root js/ts files
  getAllFiles(ROOT, ['.js', '.ts', '.mjs'], []).forEach(f => {
    if (!f.includes('node_modules') && !f.includes('dist')) files.push(f);
  });
  const patterns = [
    { re: /AIzaSy[A-Za-z0-9_-]{33}/g,           label: 'Firebase/Google API key' },
    { re: /sk-[A-Za-z0-9]{32,}/g,               label: 'OpenAI secret key' },
    { re: /password\s*[:=]\s*['"][^'"]{4,}/gi,  label: 'Hardcoded password' },
    { re: /secret\s*[:=]\s*['"][^'"]{8,}/gi,    label: 'Hardcoded secret' },
    { re: /private_key.*-----BEGIN PRIVATE/g,            label: 'Private key' },
  ];
  let found = 0;
  const checked = new Set();
  for (const f of files) {
    if (checked.has(f)) continue;
    checked.add(f);
    const src = readFileSync(f, 'utf8');
    for (const { re, label } of patterns) {
      re.lastIndex = 0;
      if (re.test(src)) {
        log('error', `Possible ${label} hardcoded in source`, shortPath(f));
        found++;
      }
    }
  }
  if (found === 0) log('pass', 'No obvious hardcoded secrets found');
  sectionEnd();
}

// ─── CHECK 8: React hooks rules (manual) ──────────────────────────────────────
function checkReactHooks() {
  sectionHeader('React Hook Pattern Issues', '⚛️');
  const files = getAllFiles(SRC, ['.jsx', '.tsx']);
  // More precise: hook call (use + uppercase letter) directly inside an if/for/while block
  // Must match: if (...) { ... useXxx( on same or next line
  const conditionalHookRe = /^\s*(?:if|for|while)\s*\(.*\)\s*\{[^}]*\n[^}]*\buse[A-Z][a-zA-Z]+\s*\(/gm;
  let found = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const matches = [...src.matchAll(conditionalHookRe)];
    for (const match of matches.slice(0, 3)) {
      const lineNum = src.slice(0, match.index).split('\n').length;
      log('warn', `Hook inside conditional/loop at line ~${lineNum}`, shortPath(f));
      found++;
    }
  }
  if (found === 0) log('pass', 'No conditional hook usage detected');
  sectionEnd();
}

// ─── CHECK 9: useEffect missing deps (simple heuristic) ──────────────────────
function checkUseEffectDeps() {
  sectionHeader('useEffect Dependency Heuristics', '🔄');
  const files = getAllFiles(SRC, ['.jsx', '.tsx']);
  let found = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      const match = line.match(/useEffect\s*\(\s*(?:async\s+)?\(\s*\)\s*=>/);
      if (!match) return;
      if (/,\s*\[[^\]]*\]\s*\)/.test(line)) return;
      const snippet = lines.slice(i, Math.min(i + 15, lines.length)).join('\n');
      if (/,\s*\[/.test(snippet)) return;
      log('warn', `useEffect with no dep array at line ${i + 1} (runs on every render)`, shortPath(f));
      found++;
    });
  }
  if (found === 0) log('pass', 'No obvious missing useEffect deps found');
  sectionEnd();
}

// ─── CHECK 10: Undefined variables (simple grep) ─────────────────────────────
function checkUndefinedVars() {
  sectionHeader('Potential Undefined Variable Patterns', '❓');
  const files = getAllFiles(SRC);
  const risky = [
    { re: /\.map\(([^)]+)\)\s*\.\s*map\(/g, label: 'Nested .map() — possible performance / null risk', lvl: 'info' },
    { re: /\?\.(.*?)\?\.(.*?)\?\./g,       label: 'Triple optional chaining — deep null chain', lvl: 'info' },
    { re: /(?<!\/\/.*)\bas\s+any\b/g,      label: '`as any` cast — bypasses type safety', lvl: 'warn' },
    { re: /(?<!\/\/.*)\b@ts-ignore\b/g,    label: '@ts-ignore — suppresses TS error', lvl: 'warn' },
    { re: /(?<!\/\/.*)\b@ts-nocheck\b/g,   label: '@ts-nocheck — disables all TS checks', lvl: 'warn' },
  ];
  let found = 0;
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const lines = src.split('\n');
    for (const { re, label, lvl } of risky) {
      re.lastIndex = 0;
      const matches = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith('//')) continue;
        const m = line.match(re);
        if (m) {
          matches.push({ ...m, line: i + 1 });
        }
      }
      if (matches.length > 0) {
        const first = matches[0];
        log(lvl, `${label} (${matches.length}x, first ~line ${first.line})`, shortPath(f));
        found++;
      }
    }
  }
  if (found === 0) log('pass', 'No risky patterns detected');
  sectionEnd();
}

// ─── CHECK 11: Package vulnerabilities ───────────────────────────────────────
function checkNpmAudit() {
  sectionHeader('npm Audit (Vulnerabilities)', '🛡️');
  const r = runCmd('npm audit --json 2>&1');
  try {
    const jsonStart = r.output.indexOf('{');
    if (jsonStart === -1) throw new Error('no json');
    const data = JSON.parse(r.output.slice(jsonStart));
    const vuln = data.metadata?.vulnerabilities ?? {};
    const total = (vuln.critical ?? 0) + (vuln.high ?? 0) + (vuln.moderate ?? 0) + (vuln.low ?? 0);
    if (vuln.critical > 0) log('error', `${vuln.critical} CRITICAL vulnerabilities in dependencies`);
    if (vuln.high > 0)     log('error', `${vuln.high} HIGH vulnerabilities in dependencies`);
    if (vuln.moderate > 0) log('warn',  `${vuln.moderate} MODERATE vulnerabilities`);
    if (vuln.low > 0)      log('info',  `${vuln.low} LOW vulnerabilities`);
    if (total === 0)       log('pass',  'No npm audit vulnerabilities');
  } catch {
    log('warn', 'Could not parse npm audit output');
  }
  sectionEnd();
}

// ─── CHECK 12: .env / sensitive files committed ───────────────────────────────
function checkEnvCommitted() {
  sectionHeader('.env File Safety', '🌍');
  const gitignore = join(ROOT, '.gitignore');
  if (!existsSync(gitignore)) {
    log('error', 'No .gitignore found — .env may be committed!');
    sectionEnd();
    return;
  }
  const gi = readFileSync(gitignore, 'utf8');
  const envFiles = ['.env', '.env.local', '.env.production', '.env.development'];
  for (const ef of envFiles) {
    const exists = existsSync(join(ROOT, ef));
    const ignored = gi.includes(ef) || gi.includes('*.env') || gi.includes('.env*');
    if (exists && !ignored) log('error', `${ef} exists but NOT in .gitignore — may leak secrets!`);
    else if (exists && ignored) log('pass', `${ef} exists and is gitignored ✓`);
  }
  sectionEnd();
}

// ─── CHECK 13: Vite build dry-run ─────────────────────────────────────────────
function checkBuild() {
  sectionHeader('Vite Build Check (no emit)', '🏗️');
  console.log(dim('  Running vite build… this may take 30–60s'));
  const r = runCmd('npx vite build --mode development 2>&1');
  if (r.ok) {
    log('pass', 'Vite build completed successfully');
    // extract bundle size info
    const sizes = r.output.match(/dist\/[^\s]+\s+[\d.]+\s+[kKmM]B/g);
    if (sizes) {
      sizes.slice(0, 8).forEach(s => log('info', s.trim()));
    }
  } else {
    const errLines = r.output.split('\n').filter(l => /error|Error/.test(l));
    errLines.slice(0, 15).forEach(l => log('error', l.trim()));
    if (errLines.length === 0) log('error', 'Build failed. Check output above.');
  }
  sectionEnd();
}

// ─── SUMMARY ──────────────────────────────────────────────────────────────────
function printSummary(startTime) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const width = 60;
  console.log('\n' + col(C.cyan + C.bold, '═'.repeat(width)));
  console.log(bold('                    📊  SCAN SUMMARY'));
  console.log(col(C.cyan + C.bold, '═'.repeat(width)));
  console.log(`  ${green('✓ Passed  ')}  ${results.passed}`);
  console.log(`  ${yellow('⚠ Warnings')}  ${results.warnings}`);
  console.log(`  ${red('✗ Errors  ')}  ${results.errors}`);
  console.log(`  ${cyan('ℹ Info    ')}  ${results.info}`);
  console.log(`  ${dim('⏱ Time    ')}  ${elapsed}s`);
  console.log(col(C.cyan + C.bold, '═'.repeat(width)));

  if (results.errors > 0) {
    console.log('\n' + red('  ❌ SCAN FAILED — fix errors before deploying\n'));
    // list top errors
    console.log(bold('  Top Errors:'));
    allIssues.filter(i => i.level === 'error').slice(0, 10).forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.msg} ${dim(issue.file ? `[${issue.file}]` : '')}`);
    });
  } else if (results.warnings > 0) {
    console.log('\n' + yellow('  ⚠ SCAN PASSED WITH WARNINGS — review before deploying\n'));
  } else {
    console.log('\n' + green('  ✅ ALL CHECKS PASSED — looking clean!\n'));
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  printHeader();

  const args = process.argv.slice(2);
  const skipBuild = args.includes('--skip-build') || args.includes('-s');
  const quickMode = args.includes('--quick') || args.includes('-q');

  console.log(dim(`  Root: ${ROOT}`));
  console.log(dim(`  Src:  ${SRC}`));
  console.log(dim(`  Mode: ${quickMode ? 'quick (skipping TS & build)' : skipBuild ? 'no-build' : 'full'}`));
  console.log(dim(`  Args: --skip-build / -s  to skip Vite build`));
  console.log(dim(`        --quick / -q        to skip TS + build`));

  // Static checks (fast)
  checkConsoleLogs();
  checkTodoFixme();
  checkImports();
  checkLargeFiles();
  checkSecrets();
  checkReactHooks();
  checkUseEffectDeps();
  checkUndefinedVars();
  checkEnvCommitted();

  // Tool-based checks
  checkESLint();
  checkNpmAudit();

  if (!quickMode) {
    checkTypeScript();
  }

  if (!skipBuild && !quickMode) {
    checkBuild();
  } else {
    console.log('\n' + dim('  ⏭  Build check skipped'));
  }

  printSummary(startTime);
  process.exit(results.errors > 0 ? 1 : 0);
}

main().catch(e => { console.error(red('Scanner crashed: ' + e.message)); process.exit(2); });

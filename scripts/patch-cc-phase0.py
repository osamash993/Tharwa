#!/usr/bin/env python3
"""Apply phase 0 once; stop on any missing/ambiguous literal target."""
from pathlib import Path
from datetime import datetime, timezone
import shutil
import subprocess

root = Path(__file__).resolve().parents[1]
main = root / 'src/main.js'
replacements = [
    ("import {setupOriginalLayout} from './original-layout.js';", "import {setupOriginalLayout} from './original-layout.js';\nimport {createCommandView} from './command-view.js';"),
    (" const dark=document.body.classList.contains('ready')&&document.documentElement.classList.contains('ios-dark');", " const dark=document.body.classList.contains('ready')&&(document.body.dataset.portfolioView==='cc'||document.documentElement.classList.contains('ios-dark'));"),
    ("attributeFilter:['class']});\nbrowserThemeObserver.observe", "attributeFilter:['class','data-portfolio-view']});\nbrowserThemeObserver.observe"),
    ("window.portfolioAPI=api.rpc;", "window.portfolioAPI=api.rpc;\nconst commandView=createCommandView({api,onError:window.cloudFailure});"),
    ("window.startPortfolio();indicator.textContent=demo?'تجربة — البيانات هنا لا تُحفظ':'جاري الاتصال…';", "window.startPortfolio();indicator.textContent=demo?'تجربة — البيانات هنا لا تُحفظ':'جاري الاتصال…';\n  await commandView.initialize();"),
    ("else {history.replaceState(null,'',location.pathname);await start();}", "else {const next=new URL(location.href);next.searchParams.delete('login');history.replaceState(null,'',next.pathname+next.search+next.hash);await start();}")
]
source = main.read_text()
for old, new in replacements:
    if source.count(old) != 1:
        raise SystemExit('FAIL: expected one target: ' + old)
backup = root / '.migration-backups' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
backup.mkdir(parents=True)
for name in ('src', 'public'):
    shutil.copytree(root / name, backup / name)
for name in ('index.html', 'package.json', 'package-lock.json'):
    shutil.copy2(root / name, backup / name)
print('OK: dated source backup', backup)
for old, new in replacements:
    source = source.replace(old, new, 1)
    print('OK:', old.splitlines()[0])
main.write_text(source)
for name in ('src/main.js', 'src/command-view.js'):
    subprocess.run(['node', '--check', str(root / name)], check=True)
    print('OK: node --check', name)
# Legacy is loaded as a classic script, not an ES module. Check in that same mode.
subprocess.run(['node', '--input-type=commonjs', '--check'], input=(root / 'public/legacy/app.js').read_text(), text=True, check=True)
print('OK: node --check classic legacy script')

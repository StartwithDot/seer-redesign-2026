"""Usage: python3 pipeline/router_build.py <task.md> <outdir_relative_to_root> --ctx file1,file2,... [--rounds 3] [--maxtok 30000]
Sends the task + context files to the AgentRouter proxy (OpenAI API at 127.0.0.1:8318), falling back across models, parses
`=== FILE: <path> ===` blocks (paths must stay inside outdir), writes them, runs tsc + vite build in the app, and feeds errors back (up to --rounds)."""
import json, os, re, subprocess, sys, time, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = ["gpt-6.1-sol", "gpt-6-astra", "gpt-5.6-sol"]
def key():
    for l in open(os.path.join(ROOT, ".env")):
        if re.match(r"^[A-Z_]*KEY=", l): return l.split("=", 1)[1].strip()
SYS = """You are a principal front-end engineer and award-level interface designer. Output ONLY file blocks in this exact format and nothing else except a final line `SUMMARY: <one sentence>`:
=== FILE: <path relative to repo root> ===
<complete file content>
=== END ===
Rules: write COMPLETE files (never diffs, never ellipses, never 'unchanged' placeholders). Only touch files under the allowed app folder. TypeScript strict, React 19, plain CSS (no Tailwind, no UI kits, no new npm packages). Keep every existing feature, route, data-testid, aria-label and behaviour working unless the task says otherwise. No em dashes anywhere (copy or comments). No gradient glows, no blurred orbs, no glassmorphism, no emoji as icons, no purple-to-pink gradients. All sizes on an 8px grid, tabular numerals for numbers, visible focus rings, prefers-reduced-motion respected, touch targets at least 40px."""
def call(model, system, user, maxtok):
    body = json.dumps({"model": model, "messages": [{"role": "system", "content": system}, {"role": "user", "content": user}], "max_tokens": maxtok}).encode()
    req = urllib.request.Request("http://127.0.0.1:8318/v1/chat/completions", body, {"Authorization": "Bearer " + key(), "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=900) as r: return json.loads(r.read())["choices"][0]["message"]["content"] or ""
def ask(user, maxtok, start=0):
    last = None
    for i in range(len(MODELS) * 2):
        m = MODELS[(start + i) % len(MODELS)]
        try:
            out = call(m, SYS, user, maxtok)
            if "=== FILE:" in out:
                open(os.path.join(ROOT, "research/usage.jsonl"), "a").write(json.dumps({"t": time.strftime("%FT%T"), "role": "router", "model": m, "chars": len(user)}) + "\n")
                print("model ok:", m, len(out), "chars"); return out
            last = "no file blocks from " + m
        except Exception as e: last = f"{m}: {e}"
        print("retry:", last); time.sleep(15)
    raise RuntimeError(last)
def apply(out, outdir):
    n = 0
    for m in re.finditer(r"=== FILE: (.+?) ===\n(.*?)\n=== END ===", out, re.S):
        p = os.path.normpath(m.group(1).strip())
        if not p.startswith(outdir + os.sep): print("SKIP outside outdir:", p); continue
        os.makedirs(os.path.dirname(os.path.join(ROOT, p)), exist_ok=True); open(os.path.join(ROOT, p), "w").write(m.group(2) + "\n"); n += 1; print("wrote", p)
    return n
def check(outdir):
    r = subprocess.run(["npx", "tsc", "--noEmit"], cwd=os.path.join(ROOT, outdir), capture_output=True, text=True)
    if r.returncode: return (r.stdout + r.stderr)[-6000:]
    r = subprocess.run(["npx", "vite", "build"], cwd=os.path.join(ROOT, outdir), capture_output=True, text=True)
    return None if r.returncode == 0 else (r.stdout + r.stderr)[-4000:]
if __name__ == "__main__":
    a = sys.argv; task = open(a[1]).read(); outdir = a[2].rstrip("/")
    ctx = [c for c in a[a.index("--ctx") + 1].split(",") if c] if "--ctx" in a else []
    rounds = int(a[a.index("--rounds") + 1]) if "--rounds" in a else 3; maxtok = int(a[a.index("--maxtok") + 1]) if "--maxtok" in a else 30000
    blocks = "\n\n".join(f"=== CONTEXT FILE: {c} ===\n{open(os.path.join(ROOT, c)).read()}\n=== END CONTEXT ===" for c in ctx)
    user = f"ALLOWED FOLDER: {outdir}/\n\nTASK:\n{task}\n\n{blocks}"
    for r in range(rounds):
        out = ask(user, maxtok, r); n = apply(out, outdir); print("files written:", n)
        err = check(outdir)
        if not err: print("BUILD OK"); break
        print("BUILD ERRORS (round", r + 1, ")\n", err[:1500])
        user += f"\n\nYOUR PREVIOUS OUTPUT FAILED TO BUILD. Fix ONLY the errors by re-emitting the complete corrected files.\nERRORS:\n{err}"
    else: print("STILL FAILING after", rounds, "rounds")

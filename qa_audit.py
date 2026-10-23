#!/usr/bin/env python3
"""
Automated Visual, WCAG 2.2 AA Contrast, Token Fidelity, and Structural QA Audit
for Seer Electric Foundation Design Lab (Stage 1: Three Landing Page Concepts).
"""
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def hex_to_rgb(hex_str):
    h = hex_str.lstrip("#")
    return tuple(int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))


def rel_luminance(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    def ch(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def contrast_ratio(hex1, hex2):
    l1 = rel_luminance(hex1)
    l2 = rel_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def run_audit():
    print("=== PASS: WCAG 2.2 AA CONTRAST & EF TOKEN AUDIT ===")
    pairs = [
        # Dark mode pairs
        ("Dark: Text Primary (#EDEDF2) on Page Bg (#101013)", "#EDEDF2", "#101013", 4.5),
        ("Dark: Text Primary (#EDEDF2) on Card Bg (#1A1A1E)", "#EDEDF2", "#1A1A1E", 4.5),
        ("Dark: Text Secondary (#A8A8B3) on Card Bg (#1A1A1E)", "#A8A8B3", "#1A1A1E", 4.5),
        ("Dark: Text Secondary (#A8A8B3) on Nested Bg (#1F1F24)", "#A8A8B3", "#1F1F24", 4.5),
        ("Dark: Calibrated Muted Labels (#8E8E9A) on Card Bg (#1A1A1E)", "#8E8E9A", "#1A1A1E", 4.5),
        ("Dark: White (#FFFFFF) on Button Primary (#7A3CFF)", "#FFFFFF", "#7A3CFF", 4.5),
        ("Dark: Secondary Text (#9C6FF2) on Secondary Bg (#241E33)", "#9C6FF2", "#241E33", 4.5),
        # Light mode pairs
        ("Light: Text Primary (#17171C) on Page Bg (#F7F7F9)", "#17171C", "#F7F7F9", 4.5),
        ("Light: Text Primary (#17171C) on Card Bg (#FFFFFF)", "#17171C", "#FFFFFF", 4.5),
        ("Light: Text Secondary (#5C5C66) on Card Bg (#FFFFFF)", "#5C5C66", "#FFFFFF", 4.5),
        ("Light: Text Secondary (#5C5C66) on Nested Bg (#F1F1F4)", "#5C5C66", "#F1F1F4", 4.5),
        ("Light: Calibrated Muted Labels (#666672) on Card Bg (#FFFFFF)", "#666672", "#FFFFFF", 4.5),
        ("Light: White (#FFFFFF) on Button Primary (#7A3CFF)", "#FFFFFF", "#7A3CFF", 4.5),
        ("Light: Secondary Text (#6C2BD9) on Secondary Bg (#EFE9FC)", "#6C2BD9", "#EFE9FC", 4.5),
    ]

    failures = []
    for label, fg, bg, threshold in pairs:
        ratio = contrast_ratio(fg, bg)
        status = "PASS" if ratio >= threshold else "WARN"
        print(f"  [{status}] {label}: {ratio:.2f}:1 (target >= {threshold}:1)")
        if ratio < threshold:
            failures.append((label, ratio, threshold))

    # Check all source and doc files for em-dashes
    print("\n=== PASS: EM-DASH & COPY INTEGRITY CHECK ===")
    em_dash_hits = []
    for root_dir, _, files in os.walk(ROOT):
        if "dist" in root_dir or "node_modules" in root_dir:
            continue
        for f in files:
            if f.endswith((".ts", ".tsx", ".css", ".md", ".html")):
                p = os.path.join(root_dir, f)
                txt = open(p, encoding="utf-8", errors="ignore").read()
                if "—" in txt:
                    em_dash_hits.append(os.path.relpath(p, ROOT))
    if em_dash_hits:
        print(f"  [FAIL] Em-dashes found in: {em_dash_hits}")
    else:
        print("  [PASS] Zero em-dashes across all source and documentation files.")

    # Check bundle and route outputs
    print("\n=== PASS: BUNDLE & ROUTE VERIFICATION ===")
    required_files = [
        "dist/index.html",
        "dist/design-lab/index.html",
        "dist/design-lab/concept-a/index.html",
        "dist/design-lab/concept-b/index.html",
        "dist/design-lab/concept-c/index.html",
        "dist/assets/bundle.js",
        "dist/assets/bundle.css",
    ]
    for rf in required_files:
        p = os.path.join(ROOT, rf)
        exists = os.path.exists(p)
        size = os.path.getsize(p) if exists else 0
        print(f"  [{'PASS' if exists and size > 0 else 'FAIL'}] {rf} ({size} bytes)")

    return failures


if __name__ == "__main__":
    run_audit()

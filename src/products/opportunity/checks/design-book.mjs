import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import ts from 'typescript';

const componentsRoot = new URL('../components/', import.meta.url);

const componentFiles = (await readdir(componentsRoot)).filter(file => file.endsWith('.tsx'));
for (const name of componentFiles) {
  const path = new URL(name, componentsRoot);
  const sourceText = await readFile(path, 'utf8');
  const source = ts.createSourceFile(name, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const inspect = node => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      const attributes = new Map();
      for (const property of node.attributes.properties) {
        if (ts.isJsxAttribute(property)) attributes.set(property.name.getText(source), property.initializer?.getText(source) ?? '');
      }
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      if (tag === 'button') {
        const submitsHandledForm = attributes.get('type') === '"submit"';
        assert(
          attributes.has('onClick') || attributes.has('onKeyDown') || submitsHandledForm,
          `${name}:${line} button has no activation path.`,
        );
      }
      if (tag === 'a') assert(attributes.has('href') || attributes.has('onClick'), `${name}:${line} link has no destination.`);
      if (tag === 'img') assert(attributes.has('alt'), `${name}:${line} image has no alt attribute.`);
    }
    ts.forEachChild(node, inspect);
  };
  inspect(source);
}

const styleRoot = new URL('../styles/', import.meta.url);
const styleFiles = (await readdir(styleRoot)).filter(file => file.endsWith('.css'));
for (const name of styleFiles) {
  const css = await readFile(new URL(name, styleRoot), 'utf8');
  assert(!/background(?:-image)?:[^;]*gradient/i.test(css), `${name} reintroduces a decorative gradient background.`);
  assert(!/backdrop-filter:\s*blur/i.test(css), `${name} reintroduces glass blur.`);
}

const css = await readFile(new URL('../styles/art-direction.css', import.meta.url), 'utf8');
assert.match(css, /\.opportunity-shell \.product-content \{[^}]*max-height:\s*none;[^}]*overflow:\s*visible/s, 'The document must own page scrolling.');
assert.match(css, /\.opportunity-shell \.board-view \{[^}]*max-height:\s*none;[^}]*overflow:\s*visible/s, 'The board must not create a second page scrollbar.');
assert.match(css, /html\[data-theme='dark'\] \.opportunity-shell/, 'Dark theme tokens are missing.');
assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.opportunity-shell \.market-evidence \{ display: grid;/, 'Mobile must retain its artwork and evidence image.');

const theme = await readFile(new URL('../hooks/useTheme.ts', import.meta.url), 'utf8');
for (const mode of ['system', 'light', 'dark']) assert.match(theme, new RegExp(`'${mode}'`));
const marketAssets = await readFile(new URL('../data/marketAssets.ts', import.meta.url), 'utf8');
assert.match(marketAssets, /opportunity_d0\.png/, 'The board needs verified product imagery.');
const gallerySources = await readFile(new URL('../data/gallery/SOURCES.md', import.meta.url), 'utf8');
assert.match(gallerySources, /144 images/); assert.match(gallerySources, /18 images/);

console.log(`Design Book source audit: ${componentFiles.length} components have activation paths and image alternatives; document scrolling, dual theme, mobile imagery and minimal surfaces pass. Browser layout remains a separate check.`);

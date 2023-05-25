import { it, expect } from 'vitest';
import { compile } from '@mdx-js/mdx';
import rehypeMdxHeadings from '../src/index.js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { fromJs } from 'esast-util-from-js';
import { source } from 'unist-util-source';

const __dirname = dirname(fileURLToPath(import.meta.url));

it('should export a list of headings', async () => {
  const file = await readFile(resolve(__dirname, './fixture/sample.md'));

  const result = await compile(file, {
    rehypePlugins: [rehypeMdxHeadings],
  });

  const ast = fromJs(result.toString(), { module: true });
  const declaration = ast.body.find((n) => n.type === 'ExportNamedDeclaration');

  if (!declaration) {
    throw new Error('missing declaration');
  }

  const { headings } = await import(
    `data:text/javascript,${encodeURIComponent(
      source(declaration, result) || '',
    )}`
  );

  expect(headings).toEqual([
    { value: 'heading 1', depth: 1 },
    { value: 'heading 2', depth: 2 },
    { value: 'heading 3', depth: 3 },
    { value: 'heading 4', depth: 4 },
    { value: 'heading 5', depth: 5 },
    { value: 'heading 6', depth: 6 },
  ]);
});

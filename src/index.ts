import { valueToEstree } from 'estree-util-value-to-estree';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import type { Plugin } from 'unified';
import type { Element, Node } from 'hast';

const exportValue = (name: string, value: unknown) => {
  return {
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name,
                  },
                  init: valueToEstree(value),
                },
              ],
              kind: 'const',
            },
            specifiers: [],
            source: null,
          },
        ],
        sourceType: 'module',
      },
    },
  };
};

const test = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tagName) => ({
  type: 'element',
  tagName,
}));

const rehypeMdxHeadings: Plugin<never[], Node<Element>, Node<Element>> = () => {
  return (ast) => {
    const headings: { value: string; id: string; depth: number }[] = [];

    visit(ast, test, (node) => {
      const value = toString(node);
      const depth = parseInt(node.tagName.slice(1, 2), 10);

      if (!value || isNaN(depth)) {
        return;
      }

      headings.push({ value, depth, ...node.properties });
    });

    ast.children.unshift(exportValue('headings', headings));
  };
};

export default rehypeMdxHeadings;

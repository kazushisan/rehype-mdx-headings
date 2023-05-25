# rehype-mdx-headings

rehype MDX plugin to export a JavaScript array of headings

## Install

This package is ESM only.

```
npm install
```

## Usage

This plugin will look for headings (h1, h2, h3, ... , h6) in your markdown file and export a list of headings as a constant.

```js
import { compile } from '@mdx-js/mdx';
import rehypeMdxHeadings from 'rehype-mdx-headings';

const content = `
# Hello

Some content here.

## World

Some more content here.
`;

await compile(content, {
  rehypePlugins: [rehypeMdxHeadings],
});
```

will roughly yield


```mdx
export const headings = [{ value: 'Hello', depth: 1 }, { value: 'World', depth: 2 }];

# Hello

Some content here.

## World

Some more content here.
```

## License

MIT © Kazushi Konosu

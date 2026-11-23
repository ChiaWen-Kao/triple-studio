import { readFile, writeFile } from 'node:fs/promises';

const questions = JSON.parse(
  await readFile(
    new URL('../src/constants/questions.json', import.meta.url),
    'utf8',
  ),
);
const url = 'https://chiawen-kao.github.io/triple-studio/';
const description =
  'Wendava Studio helps founders and businesses turn ideas into useful products, clear websites and simpler workflows. Creative thinking. Real-world solutions.';
const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        character
      ],
  );
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${url}#organization`,
      name: 'Wendava Studio',
      url,
      description,
      email: 'kaiwang2027@gmail.com',
    },
    {
      '@type': 'WebSite',
      '@id': `${url}#website`,
      name: 'Wendava Studio',
      url,
      inLanguage: 'en',
      publisher: { '@id': `${url}#organization` },
    },
    {
      '@type': 'Service',
      '@id': `${url}#services`,
      name: 'Product design, development and workflow improvement',
      provider: { '@id': `${url}#organization` },
      serviceType: [
        'Product design',
        'Website development',
        'Web and mobile application development',
        'Business workflow improvement',
      ],
      description:
        'Practical support from early ideas and prototypes to websites, applications and improvements to existing business workflows.',
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#questions`,
      url: `${url}#questions`,
      inLanguage: 'en',
      mainEntity: questions.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
};
const fallback = `<main class="section"><h1>Wendava Studio</h1><h2>Creative thinking. Real-world solutions.</h2><p>${description}</p><p>We help people with an idea find a clear direction, and help established businesses make everyday work easier.</p><h2>How we work</h2><p>The idea: understand the problem. The thinking: explore and test a useful direction. The outcome: design, build and improve the solution.</p><h2>Selected work</h2><p>Three case studies are reserved for future projects. Client names, project details and results are not yet published.</p><section id="questions"><h2>A few useful answers</h2>${questions.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('')}</section><p>Start a conversation: <a href="mailto:kaiwang2027@gmail.com">kaiwang2027@gmail.com</a></p></main>`;
const indexPath = new URL('../dist/index.html', import.meta.url);
let html = await readFile(indexPath, 'utf8');
html = html
  .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`)
  .replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script></head>`,
  );
await writeFile(indexPath, html);
await writeFile(
  new URL('../dist/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}</loc></url></urlset>`,
);
console.log('Built static search content, matching FAQ schema and sitemap.');

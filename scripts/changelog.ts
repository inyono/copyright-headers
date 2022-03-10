/**
 * This file is part of @inyono/copyright-headers.
 *
 * @copyright Copyright (c) 2018-2022 Jonas Keinholz
 * @license   https://opensource.org/licenses/MIT MIT License
 * @link      https://github.com/inyono/copyright-headers for the canonical source repository
 */
import { generateChangelog } from '@inyono/changelog'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

exec().then(() => {
  console.log('done')
})

async function exec(): Promise<void> {
  const content = generateChangelog<undefined>({
    repository: {
      firstCommit: 'df12fe2868efc66641034590c3ffd37e0896afbb',
      owner: 'inyono',
      repo: 'copyright-headers',
    },
    releases: [
      {
        tagName: 'v0.0.0',
        date: '2018-11-08',
        added: [
          'Add initial `updateLicenseHeader` function supporting JavaScript, TypeScript, PHP, PHTML and Twig.',
        ],
      },
      {
        tagName: 'v0.0.1',
        date: '2018-11-08',
        deprecated: [
          '`updateLicenseHeader` will be removed with the next breaking change. Use the new `updateCopyrightHeader` instead.',
        ],
        added: [
          'Add function `updateCopyrightHeader` with slightly different API as a replacement for `updateLicenseHeader`.',
        ],
        fixed: [
          'Handle `language.after` (e.g. `?>` for PHTML) correctly when input already starts with `language.begin` (e.g. `<?php`)',
        ],
        internal: ['Add tests.'],
      },
      {
        tagName: 'v0.0.2',
        date: '2018-11-18',
        fixed: [
          'Handle multiple multiline comments without newline in between correctly',
        ],
      },
      {
        tagName: 'v0.1.0',
        breakingChanges: [
          'Remove deprecated `updateLicenseHeader`.',
          'Drop Node v10 support.',
        ],
        added: ['Update dependencies to support Node v14.'],
      },
      {
        tagName: 'v0.2.0',
        breakingChanges: [
          'This package is now ESM only. [Learn more about ESM in this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).',
          'Drop Node v12 support.',
        ],
      },
    ],
  })

  await fs.promises.writeFile(
    path.join(__dirname, '..', 'CHANGELOG.md'),
    content
  )
}

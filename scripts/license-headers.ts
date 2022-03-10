/**
 * This file is part of @inyono/copyright-headers.
 *
 * @copyright Copyright (c) 2020-2022 Jonas Keinholz
 * @license   https://opensource.org/licenses/MIT MIT License
 * @link      https://github.com/inyono/copyright-headers for the canonical source repository
 */
import glob from 'glob'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'

import { updateCopyrightHeader } from '../src'

const g = util.promisify(glob)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const lines = [
  'This file is part of @inyono/copyright-headers.',
  '',
  `@copyright Copyright (c) 2020-2022 Jonas Keinholz`,
  '@license   https://opensource.org/licenses/MIT MIT License',
  '@link      https://github.com/inyono/copyright-headers for the canonical source repository',
]

g('@(scripts|src)/*.ts', {
  cwd: root,
}).then((files) => {
  return files.map((file) => {
    const filePath = path.join(root, file)

    return updateCopyrightHeader(filePath, {
      lines,
      shouldUpdate: (content) => {
        return content.includes('inyono')
      },
    })
  })
})

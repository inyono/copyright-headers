/**
 * This file is part of @inyono/copyright-headers.
 *
 * @copyright Copyright (c) 2020 Jonas Keinholz
 * @license   https://opensource.org/licenses/MIT MIT License
 * @link      https://github.com/inyono/copyright-headers for the canonical source repository
 */
import glob from 'glob'
import path from 'path'
import util from 'util'

import { updateCopyrightHeader } from '../src'

const g = util.promisify(glob)

const root = path.join(__dirname, '..')

const lines = [
  'This file is part of @inyono/copyright-headers.',
  '',
  `@copyright Copyright (c) 2020 Jonas Keinholz`,
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

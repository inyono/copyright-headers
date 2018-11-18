/**
 * This file is part of @splish-me/copyright-headers.
 *
 * @copyright Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 * @license   https://opensource.org/licenses/MIT MIT License
 * @link      https://github.com/splish-me/copyright-headers for the canonical source repository
 */
import * as glob from 'glob'
import * as path from 'path'
import * as util from 'util'

import { updateCopyrightHeader } from '../src'

const g = util.promisify(glob)

const root = path.join(__dirname, '..')

const lines = [
  'This file is part of @splish-me/copyright-headers.',
  '',
  `@copyright Copyright (c) 2018 Splish UG (haftungsbeschränkt)`,
  '@license   https://opensource.org/licenses/MIT MIT License',
  '@link      https://github.com/splish-me/copyright-headers for the canonical source repository'
]

g('@(scripts|src)/*.ts', {
  cwd: root
}).then(files => {
  return files.map(file => {
    const filePath = path.join(root, file)

    return updateCopyrightHeader(filePath, {
      lines,
      shouldUpdate: content => {
        return content.includes('Splish UG')
      }
    })
  })
})

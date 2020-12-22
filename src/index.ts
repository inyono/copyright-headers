/**
 * This file is part of @splish-me/copyright-headers.
 *
 * @copyright Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 * @license   https://opensource.org/licenses/MIT MIT License
 * @link      https://github.com/splish-me/copyright-headers for the canonical source repository
 */
import * as fs from 'fs'
import * as R from 'ramda'
import * as signale from 'signale'
import * as util from 'util'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

interface SourceLanguage {
  match: RegExp
  before?: string
  after?: string
  begin: string
  end: string
  buildLine: (line: string) => string
}

const cStyleComments: Pick<SourceLanguage, 'begin' | 'buildLine' | 'end'> = {
  begin: '/**',
  buildLine: (line) => {
    return ` *${line.length > 0 && !line.startsWith(' ') ? ' ' : ''}${line}`
  },
  end: ' */',
}

export const js: SourceLanguage = {
  match: /.jsx?$/,
  ...cStyleComments,
}

export const ts: SourceLanguage = {
  ...js,
  match: /.tsx?$/,
}

export const php: SourceLanguage = {
  match: /(\.php|\.php\.dist)$/,
  before: '<?php\n',
  ...cStyleComments,
}

export const phtml: SourceLanguage = {
  match: /\.phtml$/,
  before: '<?php\n',
  after: '\n?>',
  ...cStyleComments,
}

export const twig: SourceLanguage = {
  match: /\.twig$/,
  begin: '{##',
  buildLine: (line) => {
    return ` #${line.length > 0 && !line.startsWith(' ') ? ' ' : ''}${line}`
  },
  end: ' #}',
}

export interface CopyrightHeaderOptions {
  lines: string[]
  shouldUpdate?: (header: string) => Boolean
}

export async function updateLicenseHeader({
  filePath,
  ...options
}: {
  filePath: string
} & CopyrightHeaderOptions) {
  signale.warn('Deprecated, use updateCopyrightHeader instead')
  await updateCopyrightHeader(filePath, options)
}

export async function updateCopyrightHeader(
  filePath: string,
  options: CopyrightHeaderOptions
): Promise<void> {
  const language = getSourceLanguage(filePath)

  if (!language) {
    signale.fatal('Could not detect source language of', filePath)
    return
  }

  const ioOptions = { encoding: 'utf-8' }
  const oldContent = await readFile(filePath, ioOptions)

  const [status, newContent] = getUpdatedCopyrightHeader(
    oldContent,
    language,
    options
  )

  switch (status) {
    case CopyrightHeaderStatus.Added:
      signale.success('Added new license header to', filePath)
      await writeFile(filePath, newContent, ioOptions)
      break
    case CopyrightHeaderStatus.Changed:
      signale.success('Updated license header of', filePath)
      await writeFile(filePath, newContent, ioOptions)
      break
    case CopyrightHeaderStatus.External:
      signale.info(
        'Did not update existing (and possibly external) license header of',
        filePath
      )
      break
  }
}

export function getUpdatedCopyrightHeader(
  content: string,
  language: SourceLanguage,
  options: CopyrightHeaderOptions
): [CopyrightHeaderStatus, string] {
  const header = getLicenseHeader(language, options.lines)
  const existingCopyrightHeader = getFirstCopyrightHeader(content, language)

  if (!existingCopyrightHeader) {
    let newHeader = header
    let newContent = content

    const contentStartsWithOpeningTag =
      language.before && content.startsWith(language.before)

    if (language.before) {
      newHeader = language.before + newHeader

      if (contentStartsWithOpeningTag) {
        newContent = content.substring(language.before.length)
      }
    }

    if (language.after && !contentStartsWithOpeningTag) {
      newHeader += language.after
    }

    return [CopyrightHeaderStatus.Added, `${newHeader}\n${newContent}`]
  }

  if (existingCopyrightHeader === header) {
    return [CopyrightHeaderStatus.Unchanged, '']
  }

  if (
    typeof options.shouldUpdate === 'function' &&
    options.shouldUpdate(existingCopyrightHeader)
  ) {
    return [
      CopyrightHeaderStatus.Changed,
      content.replace(existingCopyrightHeader, header),
    ]
  }

  return [CopyrightHeaderStatus.External, content]
}

export enum CopyrightHeaderStatus {
  Added,
  Changed,
  Unchanged,
  External,
}

function getSourceLanguage(filePath: string) {
  const supportedLanguages = [js, ts, php, phtml, twig]

  return supportedLanguages.find((lang) => lang.match.test(filePath))
}

function getLicenseHeader(language: SourceLanguage, lines: string[]) {
  return (
    `${language.begin}\n` +
    lines.map(language.buildLine).join('\n') +
    `\n${language.end}`
  )
}

function getFirstCopyrightHeader(content: string, language: SourceLanguage) {
  const after = R.tail(R.split(language.begin, content))

  if (R.isEmpty(after)) {
    return ''
  }

  const [comment] = R.split(language.end, after.join(''))

  return `${language.begin}${comment}${language.end}`
}

/**
 * This file is part of @splish-me/copyright-headers.
 *
 * @copyright Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 * @license   https://opensource.org/licenses/MIT MIT License
 * @link      https://github.com/splish-me/copyright-headers for the canonical source repository
 */
import * as fs from 'fs'
import * as signale from 'signale'
import * as util from 'util'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const options = { encoding: 'utf-8' }

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
  buildLine: line => {
    return ` *${line.length > 0 && !line.startsWith(' ') ? ' ' : ''}${line}`
  },
  end: ' */'
}

const js: SourceLanguage = {
  match: /.jsx?$/,
  ...cStyleComments
}

const ts: SourceLanguage = {
  ...js,
  match: /.tsx?$/
}

const php: SourceLanguage = {
  match: /(\.php|\.php\.dist)$/,
  before: '<?php\n',
  ...cStyleComments
}

const phtml: SourceLanguage = {
  match: /\.phtml$/,
  before: '<?php\n',
  after: '\n?>',
  ...cStyleComments
}

const twig: SourceLanguage = {
  match: /\.twig$/,
  begin: '{##',
  buildLine: line => {
    return ` #${line.length > 0 && !line.startsWith(' ') ? ' ' : ''}${line}`
  },
  end: ' #}'
}

export async function updateLicenseHeader({
  filePath,
  lines,
  shouldUpdate = () => false
}: {
  filePath: string
  lines: string[]
  shouldUpdate?: (content: string) => boolean
}) {
  const language = getSourceLanguage(filePath)

  if (!language) {
    console.log('[ERR] Unrecognized source language:', filePath)
    return Promise.resolve()
  }

  const header = getLicenseHeader(language, lines)
  const re = getLicenseHeaderRegExp(language)

  return readFile(filePath, options).then(content => {
    const match = content.match(re)

    if (!match) {
      signale.success('Added new license header to', filePath)
      // No license header present, add license header to the beginning
      return writeFile(
        filePath,
        `${header}\n${
          language.before && content.startsWith(language.before)
            ? content.substring(language.before.length)
            : content
        }`,
        options
      )
    }

    if (match[0] === header) {
      // Nothing to do here
      return Promise.resolve()
    }

    if (shouldUpdate(match[0])) {
      signale.success('Updated license header of', filePath)
      // License header present that should be overriden
      return writeFile(filePath, content.replace(re, header), options)
    }

    signale.info(
      'Did not update existing (and possibly external) license header of',
      filePath
    )

    return Promise.resolve()
  })
}

function getSourceLanguage(filePath: string) {
  const supportedLanguages = [js, ts, php, phtml, twig]

  return supportedLanguages.find(lang => lang.match.test(filePath))
}

function getLicenseHeader(language: SourceLanguage, lines: string[]) {
  return (
    (language.before || '') +
    `${language.begin}\n` +
    lines.map(language.buildLine).join('\n') +
    `\n${language.end}` +
    (language.after || '')
  )
}

function getLicenseHeaderRegExp(language: SourceLanguage) {
  const forRe = (s: string) => s.replace(/(\?|\/|\*)/g, match => `\\${match}`)

  return new RegExp(
    `${forRe(language.before || '')}${forRe(language.begin)}\n(.+\n)*${forRe(
      language.end
    )}${forRe(language.after || '')}`
  )
}

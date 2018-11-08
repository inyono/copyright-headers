# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Add function `updateCopyrightHeader` with slightly different API as a replacement for `updateLicenseHeader`
- Add tests

### Deprecated

- `updateLicenseHeader` will be removed with the next breaking change. Use the new `updateCopyrightHeader` instead

### Fixed

- Handle `language.after` (e.g. `?>` for PHTML) correctly when input already starts with `language.begin` (e.g. `<?php`)

## [0.0.0] - 2018-11-08

### Added

- Add initial `updateLicenseHeader` function supporting JavaScript, TypeScript, PHP, PHTML and Twig.

[unreleased]: https://github.com/splish-me/copyright-headers/compare/0.0.0...HEAD
[0.0.0]: https://github.com/splish-me/copyright-headers/compare/df12fe2868efc66641034590c3ffd37e0896afbb...HEAD

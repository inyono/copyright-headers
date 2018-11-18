# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.0.2] - 2018-11-18

### Fixed

- Handle multiple multiline comments without newline in between correctly

## [0.0.1] - 2018-11-08

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

[unreleased]: https://github.com/splish-me/copyright-headers/compare/0.0.2...HEAD
[0.0.2]: https://github.com/splish-me/copyright-headers/compare/0.0.1...0.0.2
[0.0.1]: https://github.com/splish-me/copyright-headers/compare/0.0.0...0.0.1
[0.0.0]: https://github.com/splish-me/copyright-headers/compare/df12fe2868efc66641034590c3ffd37e0896afbb...HEAD

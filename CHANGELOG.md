# Changelog

All notable changes to this project will be documented in this file.

## [v0.1.0](https://github.com/inyono/copyright-headers/compare/v0.0.2..v0.1.0)

### Breaking Changes

- Remove deprecated `updateLicenseHeader`.

- Drop Node v10 support.

### Added

- Update dependencies to support Node v14.

## [v0.0.2](https://github.com/inyono/copyright-headers/compare/v0.0.1..v0.0.2) - November 18, 2018

### Fixed

- Handle multiple multiline comments without newline in between correctly

## [v0.0.1](https://github.com/inyono/copyright-headers/compare/v0.0.0..v0.0.1) - November 8, 2018

### Added

- Add function `updateCopyrightHeader` with slightly different API as a replacement for `updateLicenseHeader`.

### Deprecated

- `updateLicenseHeader` will be removed with the next breaking change. Use the new `updateCopyrightHeader` instead.

### Fixed

- Handle `language.after` (e.g. `?>` for PHTML) correctly when input already starts with `language.begin` (e.g. `<?php`)

### Internal

- Add tests.

## [v0.0.0](https://github.com/inyono/copyright-headers/compare/df12fe2868efc66641034590c3ffd37e0896afbb..v0.0.0) - November 8, 2018

### Added

- Add initial `updateLicenseHeader` function supporting JavaScript, TypeScript, PHP, PHTML and Twig.

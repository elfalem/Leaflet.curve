# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.9.2] - 2023-03-07
### Fixed
- Fix high CPU usage during zoomed animations #57
- Fix dependency vulnerabilities

## [0.9.1] - 2021-11-06
### Fixed
- Fix bug with empty curve when using canvas renderer #44

## [0.9.0] - 2021-11-03
### Added
- Add `getLatLngs` method (alias to `getPath`) #43

### Fixed
- Fix package vulnerabilities #42

## [0.8.1] - 2021-07-12
### Fixed
- Fix missing type declaration in package #40

## [0.8.0] - 2021-05-08
### Added
- Add Type Declaration file #38 

### Fixed
- Fix package vulnerabilities #34, #35

## [0.7.0] - 2020-11-24
### Fixed
- Use supplied pane when rendering curves for canvas #33
- Handle case of tracing curve not added to map #22
- Fix package vulnerabilities #28, #31

## [0.6.0] - 2020-01-08
### Added
- Add methods for greater compatibility with other libraries and base Leaflet methods #25
- Bump mixin-deep from 1.3.1 to 1.3.2 #27

## [0.5.2] - 2019-04-30
### Fixed
- Second attempt to fix outdated npm package issue #23

## [0.5.1] - 2019-04-30
### Fixed
- Fix outdated npm package issue #23

## [0.5.0] - 2019-04-16
### Added
- Support for tracing a curve to get sample points #20
- Detect browser support for ` Element.animate()` #21

## [0.4.1] - 2019-02-27
### Fixed
- Fix animated curve becoming dashed when zoomed #19

## [0.4.0] - 2019-02-02
### Added
- Support for Canvas animations.

## [0.3.0] - 2018-11-18
### Added
- Add CHANGELOG file.
- Basic support for Canvas rendering.

### Changed
- Update usage instructions in README.

## [0.2.0] - 2018-11-17
### Added
- Create npm package.
- Ability to animate curves using Web Animations API.

## 0.1.0 - 2015-09-25
### Added
- Ability to draw Bézier curves.

[Unreleased]: https://github.com/elfalem/Leaflet.curve/compare/v0.9.2...HEAD
[0.9.2]: https://github.com/elfalem/Leaflet.curve/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/elfalem/Leaflet.curve/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/elfalem/Leaflet.curve/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/elfalem/Leaflet.curve/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/elfalem/Leaflet.curve/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/elfalem/Leaflet.curve/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/elfalem/Leaflet.curve/compare/v0.1.0...v0.2.0

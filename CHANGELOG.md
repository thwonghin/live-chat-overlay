# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.6.0...v2.0.0) (2020-07-31)


### ⚠ BREAKING CHANGES

* This adapts the change on Youtube calling chat API (new URL & using `fetch` instead of `xhr`)

### Bug Fixes

* metrics for calculate element width ([#221](https://github.com/thwonghin/live-chat-overlay/issues/221)) ([418a5cc](https://github.com/thwonghin/live-chat-overlay/commit/418a5cc075e3ad62465c4210e7c8d2a6a2f1328f))
* new api url & fetch interceptor([#246](https://github.com/thwonghin/live-chat-overlay/issues/246)) ([49b23a0](https://github.com/thwonghin/live-chat-overlay/commit/49b23a0ff8cef8d2c5ca8c11481bd33579095456))

## [1.6.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.5.1...v1.6.0) (2020-07-19)


### Features

* accurate chat placement ([#213](https://github.com/thwonghin/live-chat-overlay/issues/213)) ([b31b2d7](https://github.com/thwonghin/live-chat-overlay/commit/b31b2d7171c4ce785bdf45cf5d20b28dc58b4ab0))


### Bug Fixes

* overlapping two line message ([#212](https://github.com/thwonghin/live-chat-overlay/issues/212)) ([0944753](https://github.com/thwonghin/live-chat-overlay/commit/094475312bd66c6ea229f4e6f8d19641c6460f7b))

### [1.5.1](https://github.com/thwonghin/live-chat-overlay/compare/v1.5.0...v1.5.1) (2020-07-19)


### Bug Fixes

* toggle btn size ([#209](https://github.com/thwonghin/live-chat-overlay/issues/209)) ([e6b5e50](https://github.com/thwonghin/live-chat-overlay/commit/e6b5e5083e1be3e7844327485a76b2ceddc54fe9))
* tune chat outdate constraint ([#211](https://github.com/thwonghin/live-chat-overlay/issues/211)) ([3a12218](https://github.com/thwonghin/live-chat-overlay/commit/3a12218b9211e76076d041e1a0ffa33e7de28a1c))

## [1.5.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.3.3...v1.5.0) (2020-07-17)


### Features

* show initial chat messages ([#202](https://github.com/thwonghin/live-chat-overlay/issues/202)) ([8301621](https://github.com/thwonghin/live-chat-overlay/commit/8301621a41448761b1bdc0936a45f076acefef39))


### Bug Fixes

* live chat is delayed ([#208](https://github.com/thwonghin/live-chat-overlay/issues/208)) ([89b49e0](https://github.com/thwonghin/live-chat-overlay/commit/89b49e099f1d5c8f7b7f85b13b0acdb4d6d268d7))
* live delay not consistent ([#201](https://github.com/thwonghin/live-chat-overlay/issues/201)) ([0ba4aca](https://github.com/thwonghin/live-chat-overlay/commit/0ba4aca89fb4718305d85f6a858e529dd92fe378))

## [1.4.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.3.3...v1.4.0) (2020-07-17)


### Features

* show initial chat messages ([#202](https://github.com/thwonghin/live-chat-overlay/issues/202)) ([8301621](https://github.com/thwonghin/live-chat-overlay/commit/8301621a41448761b1bdc0936a45f076acefef39))


### Bug Fixes

* live chat is delayed ([#208](https://github.com/thwonghin/live-chat-overlay/issues/208)) ([89b49e0](https://github.com/thwonghin/live-chat-overlay/commit/89b49e099f1d5c8f7b7f85b13b0acdb4d6d268d7))
* live delay not consistent ([#201](https://github.com/thwonghin/live-chat-overlay/issues/201)) ([0ba4aca](https://github.com/thwonghin/live-chat-overlay/commit/0ba4aca89fb4718305d85f6a858e529dd92fe378))

### [1.3.3](https://github.com/thwonghin/live-chat-overlay/compare/v1.3.2...v1.3.3) (2020-07-09)


### Bug Fixes

* cleanup two-lines items logic ([#184](https://github.com/thwonghin/live-chat-overlay/issues/184)) ([42bd930](https://github.com/thwonghin/live-chat-overlay/commit/42bd9309f775ab93629e5bcbaedf1a4c5081d910))
* handle player state change ([#183](https://github.com/thwonghin/live-chat-overlay/issues/183)) ([9eac7b6](https://github.com/thwonghin/live-chat-overlay/commit/9eac7b674588a726c962b8d8bfe90b1caa1d0d93))
* relax outdated condition ([#185](https://github.com/thwonghin/live-chat-overlay/issues/185)) ([6b57c04](https://github.com/thwonghin/live-chat-overlay/commit/6b57c046ccf9f742f78f644c9ce1e50b443f8813))

### [1.3.2](https://github.com/thwonghin/live-chat-overlay/compare/v1.3.1...v1.3.2) (2020-07-08)


### Bug Fixes

* avoid duplicate chat ([#148](https://github.com/thwonghin/live-chat-overlay/issues/148)) ([b7589a5](https://github.com/thwonghin/live-chat-overlay/commit/b7589a50b56ef8313338227d19b25b28e584f4ab))
* avoid overlayed chat messages ([#182](https://github.com/thwonghin/live-chat-overlay/issues/182)) ([dddd4ca](https://github.com/thwonghin/live-chat-overlay/commit/dddd4ca5192d4b38227b567cf3165b29df177c23))

### [1.3.1](https://github.com/thwonghin/live-chat-overlay/compare/v1.3.0...v1.3.1) (2020-06-19)


### Bug Fixes

* not stopping chat event when go to next video ([#146](https://github.com/thwonghin/live-chat-overlay/issues/146)) ([779e3d4](https://github.com/thwonghin/live-chat-overlay/commit/779e3d416651cc732344bb3aa4d31adf34c6dbf4))

## [1.3.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.2.0...v1.3.0) (2020-06-16)


### Features

* display process queue length in debug mode ([#125](https://github.com/thwonghin/live-chat-overlay/issues/125)) ([7907991](https://github.com/thwonghin/live-chat-overlay/commit/7907991393224b932fa0f8c96ab7932c9c49fa9d))
* i18n ([#137](https://github.com/thwonghin/live-chat-overlay/issues/137)) ([8a8d5ca](https://github.com/thwonghin/live-chat-overlay/commit/8a8d5caa41a533dd94029de79ecfe58dff2fa045))
* simple benchmark in debug mode ([#122](https://github.com/thwonghin/live-chat-overlay/issues/122)) ([6b2b55c](https://github.com/thwonghin/live-chat-overlay/commit/6b2b55ce176fb68f6199af3a5e035ac26a30fbc9))
* toggle btn to show chat flow ([#136](https://github.com/thwonghin/live-chat-overlay/issues/136)) ([e82d437](https://github.com/thwonghin/live-chat-overlay/commit/e82d437ed400d70caa6e1875e23240b40c51e8a0))


### Bug Fixes

* missing key for render benchmark ([#123](https://github.com/thwonghin/live-chat-overlay/issues/123)) ([f0f2114](https://github.com/thwonghin/live-chat-overlay/commit/f0f21149c092398912fe946226612e9fa3407adb))

## [1.2.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.1.0...v1.2.0) (2020-06-12)


### Features

* init debug mode ([#117](https://github.com/thwonghin/live-chat-overlay/issues/117)) ([4fd6f23](https://github.com/thwonghin/live-chat-overlay/commit/4fd6f23e89b177204d2446148b528a7783c7e9b5))


### Bug Fixes

* chat event dispatcher ([#119](https://github.com/thwonghin/live-chat-overlay/issues/119)) ([8f5675d](https://github.com/thwonghin/live-chat-overlay/commit/8f5675d04f6196e0453241ab47d8a859b2a4eb61))

## [1.1.0](https://github.com/thwonghin/live-chat-overlay/compare/v1.0.5...v1.1.0) (2020-06-06)


### Features

* get chat from intercepted response ([#108](https://github.com/thwonghin/live-chat-overlay/issues/108)) ([58003c3](https://github.com/thwonghin/live-chat-overlay/commit/58003c348d6c1c0673a6c1712840391fde6089cc))

### [1.0.5](https://github.com/thwonghin/live-chat-overlay/compare/v1.0.4...v1.0.5) (2020-05-19)

### [1.0.4](https://github.com/thwonghin/live-chat-overlay/compare/v1.0.3...v1.0.4) (2020-05-09)


### Bug Fixes

* message width estimation ([#37](https://github.com/thwonghin/live-chat-overlay/issues/37)) ([9a94c38](https://github.com/thwonghin/live-chat-overlay/commit/9a94c389458b2d3de92f2f92cb638418368b2241))

### [1.0.3](https://github.com/thwonghin/live-chat-overlay/compare/v1.0.2...v1.0.3) (2020-05-08)

### [1.0.2](https://github.com/thwonghin/live-chat-overlay/compare/v1.0.1...v1.0.2) (2020-05-07)

# Change Log
All notable changes to this project will be documented in this file.

## [1.0.0] - 2017-04-01
### Added
- Support for state parameter to protect against cross-site request forgery attacks. Requires users to use the provided `/login` url and moves redirect url from `/` to `/callback`

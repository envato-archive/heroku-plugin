# @envato/heroku-plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [heroku](#heroku)
- [Developing](#developing)
- [Commands](#commands)
<!-- tocstop -->

# Developing

```
$ heroku plugins:link
$ heroku verify-release ...
```

# Commands

<!-- commands -->

- [`heroku verify-release RELEASE`](#heroku-verify-release-release)

## `heroku verify-release RELEASE`

Verify a successful release

```
USAGE
  $ heroku verify-release RELEASE

ARGUMENTS
  RELEASE  release number

OPTIONS
  --app=app          (required) app name
  --timeout=timeout  [default: 30000] how long should we poll for

DESCRIPTION
  ...
  Exits with a non zero exit code when the release failed
```

_See code: [src/commands/verify-release.ts](https://github.com/envato/heroku-plugin/blob/v0.0.1/src/commands/verify-release.ts)_

<!-- commandsstop -->

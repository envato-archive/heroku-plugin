# @envato/heroku-plugin

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [@envato/heroku-plugin](#envatoheroku-plugin)
* [Usage](#usage)
* [Developing](#developing)
* [Commands](#commands)
<!-- tocstop -->

# Usage

Install from npmjs.org

```
$ heroku plugins:install @envato/heroku-plugin
$ heroku verify-release ...
```

# Developing

```
$ heroku plugins:link
$ heroku verify-release ...
```

# Publishing

See https://docs.envato.net/elements/#/Releasing-@envato-heroku-plugin

# Commands

<!-- commands -->
* [`heroku verify-release [RELEASE]`](#heroku-verify-release-release)

## `heroku verify-release [RELEASE]`

Verify a successful release 

```
USAGE
  $ heroku verify-release [RELEASE]

ARGUMENTS
  RELEASE  release number (default: latest)

OPTIONS
  --app=app          (required) app name
  --timeout=timeout  [default: 30000] how long should we poll for

DESCRIPTION
  ...
  Exits with a non zero exit code when the release failed
```

_See code: [src/commands/verify-release.ts](https://github.com/envato/heroku-plugin/blob/v0.0.4/src/commands/verify-release.ts)_
<!-- commandsstop -->

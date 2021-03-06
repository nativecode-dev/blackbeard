# blackbeard

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lernajs.io/)

<p align="center">
  <img src="assets/blackbeard-temp.png">
</p>

`blackbeard` is a set of libraries and applications that form the basis for an advanced media management system. Designed for large media libraries that span in the terabytes and hardware capable of running a set of microservices is required first.

We do plan in the future to release something more consumer-friendly. However, that is not the current goal of the project since there is a lot of foundational work required.

# Why

You might be asking yourself, "Do I really need another media management application?" and the honest answer is: you probably don't. `blackbeard` was born out of a personal need to manage my own media collection, which has become unwieldly over the years.

So what are some of the existing solutions out there? A lot of people use either [SickBeard](http://sickbeard.com) or the [Radarr](https://radarr.video)/[CouchPotato](https://couchpota.to) and [Sonarr](https://sonarr.tv)) combination. These are great tools and `blackbeard` is not meant to replace them. Rather, managing both seperately is a pain. There's also [Ombi](https://www.ombi.io), but I find it's still not entirely what I want. You see, I also need videos converted as well as a desire to crowdsource some sort of download verification system.

So if you're just looking for something where you can add, search, and manage media...please do check out [Ombi](https://www.ombi.io)!

However, if your library is getting out of hand or you want to perform mass operations against videos, then continue on, brave soul!

Supported Applications

- [Plex](https://www.plex.tv)
- [Radarr](https://radarr.video)
- [Sonarr](https://sonarr.tv)
- [NZBGet](https://nzbget.net)
- [Deluge](http://deluge-torrent.org)

# Architecture

`blackbeard` is designed to be run in a distributed environment, but not necessarily remotely. The project is spit into several smaller projects that are responsible for their slice of work. Compromised of a set of microservices, `blackbeard` is designed from the ground-up to be distributed. You will normally only have one or two instances running at any given moment, but if you know you are going to be running a large operation against your media files, you can spin up additional instances as needed even if you already started said large job.

At the heart of how `blackbeard` achieves distributedness is [Hydra](https://github.com/flywheelsports/hydra), a great framework for creating services that are self-disoverable as well as has built-in support for load balancing. All of `blackbeard`'s communications is handled via [Hydra](https://github.com/flywheelsports/hydra) and is a core feature of every derived `HydraModule`. 

Currently, the project is split into three projects:

- `@nativecode/blackbeard/core`
- `@nativecode/blackbeard/services`
- `@nativecode/blackbeard/ui`

## blackbeard.core

[![Travis](https://img.shields.io/travis/nativecode-dev/blackbeard.svg?style=flat-square&label=travis)](https://travis-ci.org/nativecode-dev/blackbeard)
[![npm (scoped)](https://img.shields.io/npm/v/@beard/core.svg?style=flat-square)](https://www.npmjs.com/package/@beard/core)

Comprises the core library which contains various base types and models.

- `core` contains core application services such as logging.
- `models` contains model definitions.

## blackbeard.core.node

[![Travis](https://img.shields.io/travis/nativecode-dev/blackbeard.svg?style=flat-square&label=travis)](https://travis-ci.org/nativecode-dev/blackbeard)
[![npm (scoped)](https://img.shields.io/npm/v/@beard/core.node.svg?style=flat-square)](https://www.npmjs.com/package/@beard/core.node)

Provides implementations and features focused on the node runtime.

- `datatore` contains data access clients such as to `couchbase`.
- `hydra` contains classes that encapsulates [Hydra](https://github.com/flywheelsports/hydra) functionality.
- `modules` contains modules that can be run for a particular instance.
- `scripts` contains some basic scripts.

## blackbeard.services

Provides a set of services.

Production Ready

- `ircwatch` watches an IRC announce channel for specific links to push to `Radarr` or `Sonarr`.
- `scheduler` runs pre-defined scripts on a given schedule.

Work In Progess

- `ui` front-end management interface.

Planning Stages

- `orchestrator` manages service deployments.
- `transcode` performs media conversions.

## blackbeard.ui

Provides a front-end to manage all of the service instances in addition to managing the media library. If you are running an `orchestrator` instance, you can create new instances either via a VM API call such as to an `ESX` or `Hyper-V` server.

# Developer Setup

1. Install [lerna](https://lernajs.io) globally. If you are using [yarn](https://yarnpkg.com), just type: `yarn global add lerna`
2. Run `git clone https://github.com/nativecode-dev/blackbeard`
3. Run `yarn build` to download packages and build the projects.

> Please see the [lerna](https://lernajs.io) [documentation](https://github.com/lerna/lerna/#commands) for additional commands.

# Contributions

Currently, we are not accepting contributions except on a case-by-case basis. Please do not post a PR for your changes as it will be declined. If you feel you are the exception, please send an email to [support@nativecode.com](mailto:support@nativecode.com) and we can discuss your situation.

However, fear not! As soon as a solid process is put in place to allow contributions, we will happily process your PR!

# License
© 2017 NativeCode Development <support@nativecode.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

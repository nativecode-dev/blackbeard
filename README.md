# blackbeard

Blackbeard is a custom set of applications that are run inside a docker container and manages common and
tedious background tasks for your media-centric NAS environments. Though designed and written as a microservice for docker environments, you can run the services separately and we're exploring the ability to package the services as self-containerd executables.

Currently, Blackbeard supports [Sonarr](https://sonarr.tv/) and [Radarr](https://radarr.video/) as media managers.

# Installation (docker)
```bash
docker pull mikepham/blackbeard:latest
docker run --name blackbeard \
  --build-arg RADARR_APIKEY=<APIKEY> \
  --build-arg RADARR_ENDPOINT=<ENDPOINT> \
  --build-arg SONARR_APIKEY=<APIKEY> \
  --build-arg SONARR_ENDPOINT<enDPOINT> \
  mikepham/blackbeard:latest \
```

## Architecture

# License
Copyright 2017 NativeCode Development <support@nativecode.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without
limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

# `micro-github`

A tiny microservice to add authentication with GitHub to your application.

## Usage

Running your own `micro-github` is a single [`now`](https://now.sh) command away:

```sh
now -e GH_CLIENT_ID=xyz123 -e GH_CLIENT_SECRET=asdf123 -e REDIRECT_URL=https://google.com mxstbr/micro-github # Deploy this repository using now.sh
```

You'll need to provide three environment variables:

```sh
# Your GitHub application client id
GH_CLIENT_ID=xyz123
# Your GitHub application client secret
GH_CLIENT_SECRET=xyz123
# The URL to redirect the user to once the authentication was successful
REDIRECT_URL=xyz123
```

> Create an application on GitHub [here](https://github.com/settings/applications/new) to get your client id and secret if you haven't done that already.

The user will be redirected to the `REDIRECT_URL` with the `access_token` query param set to the GitHub access token. E.g. setting `REDIRECT_URL=https://google.com` will redirect them to `https://google.com/?access_token=asdf123`. (where `asdf123` is the provided access token)

## Development

```sh
git clone git@github.com:mxstbr/micro-github.git
```

## License

Copyright (c) 2017 Maximilian Stoiber, licensed under the MIT license. See [LICENSE.md](LICENSE.md) for more information.

# `micro-github`

A tiny microservice that makes adding authentication with GitHub to your application easy.

## Usage

Running your own `micro-github` is a single [`now`](https://now.sh) command away:

```sh
# Deploy this repository using now.sh
now mxstbr/micro-github -e GH_CLIENT_ID=xyz123 -e GH_CLIENT_SECRET=asdf123 -e REDIRECT_URL=https://google.com
```

### Environment variables

You'll need to provide three environment variables when running `micro-github`:

```sh
# Your GitHub application client id
GH_CLIENT_ID=xyz123
# Your GitHub application client secret
GH_CLIENT_SECRET=asdf123
# The URL to redirect the user to once the authentication was successful
REDIRECT_URL=https://google.com
```

> Create an application on GitHub [here](https://github.com/settings/applications/new) to get your client id and secret if you haven't done that already.

The user will be redirected to the `REDIRECT_URL` with the `access_token` query param set to the GitHub access token. E.g. setting `REDIRECT_URL=https://google.com` will redirect them to `https://google.com/?access_token=asdf123`. (where `asdf123` is the provided access token)

### Finish setup

To make this work you have to set the authorization callback URL of [your application on GitHub](https://github.com/settings/developers) to whatever URL `now` gave you:

![Authorization callback URL: 'your-url.now.sh'](https://cloud.githubusercontent.com/assets/7525670/22621592/95546272-eb27-11e6-80f3-6a2cd556d319.png)

To log people in they just have to click on a link to

```
https://github.com/login/oauth/authorize?client_id=asdf123
```

Adding the client id that you got from GitHub as the `client_id` query param. (instead of `asdf123` in the example above)

Then whatever you specified as the `REDIRECT_URL` will be called with the access token from GitHub for you to use! 🎉

### Error handling

In case an error happens (either by the service or on GitHub) the user will be redirected to the `REDIRECT_URL` with the `error` query param set to a relevant error message.

## Development

```sh
git clone git@github.com:mxstbr/micro-github.git
```

Move `.env.example` to `.env` and fill in your GitHub API details and redirect url

```sh
npm run dev
```

The server will then be listening at `localhost:3000`, so set the authorization callback URL of your dev application on GitHub to that.

## License

Copyright (c) 2017 Maximilian Stoiber, licensed under the MIT license. See [LICENSE.md](LICENSE.md) for more information.

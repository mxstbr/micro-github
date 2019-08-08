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
# Optional: Specify the GitHub host when using GitHub Enterprise
GH_HOST=github.my-company.com
```

> Create an application on GitHub [here](https://github.com/settings/applications/new) to get your client id and secret if you haven't done that already.

When authentication was successful, the user will be redirected to the `REDIRECT_URL` with the `access_token` query param set to the GitHub access token. You can then use that token to interact with the [GitHub API](https://developer.github.com/v3/)!

> E.g. setting `REDIRECT_URL=https://google.com` will redirect them to `https://google.com/?access_token=asdf123`. (where `asdf123` is the provided access token)

### Finish setup

To make this work you have to set the authorization callback URL of [your application on GitHub](https://github.com/settings/developers) to whatever URL `now` gave you plus the path `/api/callback` e.g. `http://localhost:3000/api/callback`:

![Authorization callback URL: 'your-url.now.sh'](https://user-images.githubusercontent.com/174475/62680084-3e566780-b96b-11e9-9fb8-986da2356abe.png)

To log people in provide a link to url `now` gave you plus the path `/api/login` e.g. `http://localhost:3000/api/login` when they click on the link it will redirect to `https://github.com/login/oauth/authorize?client_id=asdf123&state`. (where `client_id` is your GitHub app client id in `.env` and `state` is a randomly generated string). This will redirect them to the GitHub sign in page for your app, which looks like this:

![Authorize my app to access your data on GitHub](https://cloud.githubusercontent.com/assets/7525670/22627265/fc50c680-ebbf-11e6-9126-dcdef37d3c3d.png)

> You can change the scope of the data you can access with the `scope` query param, see the [GitHub docs](https://developer.github.com/v3/oauth/#scopes)!

When authentication is successful, the user will be redirected to the `REDIRECT_URL` with the access token from GitHub for you to use! 🎉

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

The server will then be listening at `localhost:3000`, so set the authorization callback URL of your dev application on GitHub to `http://localhost:3000/callback`.

## Updating

The `master` branch of this repository is what you will be deploying. To update to a new version with potential bugfixes, all you have to do is run the `now` command again and then set the authorization callback URL on GitHub to the new URL that `now` gave you! 👌

## License

Copyright (c) 2017 Maximilian Stoiber, licensed under the MIT license. See [LICENSE.md](LICENSE.md) for more information.

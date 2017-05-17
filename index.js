require('dotenv').config()
const querystring = require('querystring')
const axios = require('axios')
const { send } = require('micro')
const { router, get } = require('microrouter');
const redirect = require('micro-redirect');
const uid = require('uid-promise');

const githubUrl = process.env.GH_HOST || 'github.com'

const states = [];

const redirectWithQueryString = (res, data) => {
  const location = `${process.env.REDIRECT_URL}?${querystring.stringify(data)}`
  redirect(res, 302, location)
}

const login = async (req, res) => {
  const state = await uid(20);
  const scope = process.env.SCOPE ? `&scope=${encodeURI(process.env.SCOPE)}` : '';
  states.push(state);
  redirect(res, 302, `https://${githubUrl}/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&state=${state}${scope}`)
};

const callback = async (req, res) => {

  res.setHeader('Content-Type', 'text/html')
  const { code, state } = req.query

  if (!code && !state) {
    redirectWithQueryString(res, { error: 'Provide code and state query param' })
  } else if (!states.includes(state)) {
    redirectWithQueryString(res, { error: 'Unknown state' })
  } else {
    states.splice(states.indexOf(state), 1);
    try {
      const { status, data } = await axios({
        method: 'POST',
        url: `https://${githubUrl}/login/oauth/access_token`,
        responseType: 'json',
        data: {
          client_id: process.env.GH_CLIENT_ID,
          client_secret: process.env.GH_CLIENT_SECRET,
          code
        }
      })

      if (status === 200) {
        const qs = querystring.parse(data)
        if (qs.error) {
          redirectWithQueryString(res, { error: qs.error_description })
        } else {
          redirectWithQueryString(res, { access_token: qs.access_token })
        }
      } else {
        redirectWithQueryString(res, { error: 'GitHub server error.' })
      }
    } catch (err) {
      redirectWithQueryString(res, { error: 'Please provide GH_CLIENT_ID and GH_CLIENT_SECRET as environment variables. (or GitHub might be down)' })
    }
  }
}

module.exports = router(
  get('/login', login),
  get('/callback', callback)
);

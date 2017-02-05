require('dotenv').config()
const url = require('url')
const querystring = require('querystring')
const axios = require('axios')
const { send } = require('micro')

const createRedirectHTML = (data) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting…</title>
  </head>
  <body>
    <script>
      window.location.href = '${process.env.REDIRECT_URL}?${querystring.stringify(data)}';
    </script>
  </body>
</html>
`

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const { query: { code } } = url.parse(req.url, true)
  if (!code) {
    send(res, 401, createRedirectHTML({ error: 'Provide code query param' }))
  } else {
    try {
      const { status, data } = await axios({
        method: 'POST',
        url: 'https://github.com/login/oauth/access_token',
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
          send(res, 401, createRedirectHTML({ error: qs.error_description }))
        } else {
          send(res, 200, createRedirectHTML({ access_token: qs.access_token }))
        }
      } else {
        send(res, 500, createRedirectHTML({ error: 'GitHub server error.' }))
      }
    } catch (err) {
      send(res, 500, createRedirectHTML({ error: 'Please provide GH_CLIENT_ID and GH_CLIENT_SECRET as environment variables. (or GitHub might be down)' }))
    }
  }
}

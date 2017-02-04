require('dotenv').config()
const url = require('url')
const querystring = require('querystring')
const axios = require('axios')
const { send } = require('micro')

const createRedirectHTML = (token) => `
<html>
	<head>
		<title>Redirecting…</title>
	</head>
	<body>
		<script>
			window.location.href = '${process.env.REDIRECT_URL}?access_token=${token}';
		</script>
	</body>
</html>
`

module.exports = async (req, res) => {
	const { query: { code } } = url.parse(req.url, true)
	if (!code) {
		send(res, 401, 'Unauthorized')
	} else {
		const { status, data } = await axios({
			method: 'POST',
			url: 'https://github.com/login/oauth/access_token',
			responseType: 'json',
			data: {
				client_id: process.env.GH_CLIENT_ID,
				client_secret: process.env.GH_CLIENT_SECRET,
				code,
			},
		})

		if (status === 200) {
			const qs = querystring.parse(data)
			res.setHeader('Content-Type', 'text/html');
			send(res, 200, createRedirectHTML(qs.access_token))
		} else {
			send(res, 401, 'Unauthorized')
		}
	}
}

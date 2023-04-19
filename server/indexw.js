// const express = require('express')
// const request = require('request');
// const dotenv = require('dotenv');

// const port = 5000

// global.access_token = ''

// var cors = require('cors');
// var cookieParser = require('cookie-parser');
// dotenv.config()

// var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
// var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET
// var spotify_redirect_uri = 'http://localhost:3000/auth/callback'
// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function (length) {
//   var text = '';
//   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };
// var stateKey = 'spotify_auth_state';
// var app = express();

// app.use(express.static(__dirname + '/public'))
//    .use(cors())
//    .use(cookieParser());

// app.get('/auth/login', (req, res) => {

//   var scope = "streaming user-read-email user-read-private"
//   var state = generateRandomString(16);
//   res.cookie(stateKey, state);
//   var auth_query_parameters = new URLSearchParams({
//     response_type: "code",
//     client_id: spotify_client_id,
//     scope: scope,
//     redirect_uri: spotify_redirect_uri,
//     state: state
//   })

//   res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
// })

// app.get('/auth/callback', (req, res) => {

//     var code = req.query.code;
//     res.clearCookie(stateKey);
//   var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri: spotify_redirect_uri,
//       grant_type: 'authorization_code'
//     },
//     headers: {
//       'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
//       'Content-Type' : 'application/x-www-form-urlencoded'
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       access_token = body.access_token;
//       refresh_token = body.refresh_token;
//       res.redirect('/')
//     }
//   });

// })

// app.get('/auth/token', (req, res) => {
//   res.json({ access_token: access_token})
// })

// app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}`)
// })
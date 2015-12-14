# React starterkit

Server: Koa, React + router + Redux isomorphic rendering, Jade  
Client: React + router + Redux, Sass


## Setup

``` sh
npm install
```


## Development

To start the node server (watching) run:
``` sh
npm run watch
```
The browser entry point while developing is `127.0.0.1:3000`. 
Webpack middleware will handle all `/assets` requests, while all other requests will be handled by Koa


## Testing

Tests are run with Mocha + Expect for both client and server:
``` sh
npm run test 
# or
npm run test:watch # for TDD
```
React components testing is done with [Enzyme](https://github.com/airbnb/enzyme/), a library that allows you to use a jQuery-like API to query the virtual dom.


## Production

First, build the JS file and the CSS file (extracted):
``` sh
npm run build
```

To run node with production env:
``` sh
NODE_ENV=production npm run start
```
Now `127.0.0.1:3000` will serve your entire app.

##### No need of a node server?

``` sh
npm run build:template
```
Will build `index.jade` to `public/index.html`, ready to be served. 


## ENV variables

You can dynamically change some behaviors of the app by either prepending these props to the shell command or by adding them to a `.env` file.

**NODE_ENV** `string`  
Set node environment: `development`, `test`, `production` (default: `development`)

**PORT** `int`  
Koa node server listening port (default: `3000`)

**WDS_PORT** `int`  
Webpack dev server listening port (default: `8080`)

**COOKIE_SECRET** `string`  
Set the string used to encrypt  (default: `cookie-secret`)

**GA_PROPERTY** `string`  
Set the Google Analytics property and renders the dedicated script tag (default: `''`)


## Config variables

You can persistently change some behaviors of the app by tweaking `lib/config.js`.

**react.isomorphic**  
Toggle on/off React server side rendering (default: `true`)  
NOTE: this will make node no longer return 404s. You'll have to handle them client side. 


## Info & Troubleshooting

**No need of React-router?**  
You can easily get rid of it on the client side by removing `./routes` and `history` imports from `client.js` and by rendering `<App />` directly (it will reduce the minified bundle size by 95kB). The router will still be used by the server to provide 404s.

**Missing CSS while serving from node the built bundle?**  
The external CSS file is loaded by `index.jade` only if the node env is not `development`. 
Try: `NODE_ENV=test npm run start`

**Getting blank page on reload? Or error 502?**
No worries, that means that the node server was restarting while you refreshed the browser. We restart node on every change so the server-side rendering is always up-to-date. Unfortunately, Babel slows down the process so it might take 2-3 seconds to reboot.


## Todo

- Use [babel-eslint](https://github.com/babel/babel-eslint) parser (v5.0.0+ needed)
- Use [react-transform](https://github.com/gaearon/react-transform-boilerplate) for hot reloading (v3.0.0+ needed)


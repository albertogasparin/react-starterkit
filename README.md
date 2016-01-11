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
The default browser entry point while developing is `127.0.0.1:3000`. 
Webpack middleware will handle all `/assets` requests, while all other requests will be handled by Koa



## Testing

Tests are run with Mocha + Expect for both client and server:
``` sh
npm run test 
# or
npm run test:watch # for TDD
```
React components testing is done with [Enzyme](https://github.com/airbnb/enzyme/), a library that allows you to use a jQuery-like API to query the virtual dom.

Code coverage (istanbul) reports are also available thanks to [Isparta](https://github.com/douglasduteil/isparta):
``` sh
npm run coverage
```


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
npm run build:static
```
Will build the assets and render `index.jade` to `public/index.html`, ready to be served. 



## ENV variables

You can dynamically change some behaviors of the app by either prepending these props to the shell command or by adding them to a `.env` file.

**NODE_ENV** `string`  
Set node environment: `development`, `test`, `production` (default: `development`)

**HOST** `string`  
Koa server host IP address (default: `127.0.0.1`)

**PORT** `int`  
Koa server listening port (default: `3000`)

**COOKIE_SECRET** `string`  
Set the string used to encrypt (default: `cookie-secret`)

**GA_PROPERTY** `string`  
Set the Google Analytics property and renders the dedicated script tag (default: `''`)



## Config variables

You can persistently change some behaviors of the app by tweaking `lib/config.js`.

**react.isomorphic**  
Toggle on/off React server side rendering (default: `true`)  
NOTE: this will make node no longer return 404s. You'll have to handle them with react-router. 



## Adding API endpoints

The current implementation loads automatically all modules inside `./api` folder. 
To create a set of endpoints `/api/users` for instance, add `users/index.js` inside the `./api` folder. Then define your methos (like `list()`, `create()`, ...) and export an object with:  
  - keys: `GET/POST/PUT/DELETE` *space* `name`
  - values: the generator function that will be called by the router

``` js
export default {
  'GET /todos': list,
  'POST /todos': create,
  'PUT /todos/:id': update,
};
```



## Info & Troubleshooting

**No need of React-router**  
You can easily get rid of it on the client side by removing `./routes` and `history` imports from `client.js` and by rendering `<App />` directly (it will reduce the minified bundle size by 95kB). The router will still be used by the server to provide 404s.

**Missing CSS while serving the built bundle**  
The external CSS file is loaded by `index.jade` only if the node env is not `development`.  
Try: `NODE_ENV=test npm run start`

**Missing CSS-defined assets when testing on a VM or network-connected device**  
This is a known limitation of [style-loader](https://github.com/webpack/style-loader/issues/55). The assets URL produced by that loader are absolute, so you need to explictly set your host LAN IP address.  
Example: `HOST=192.168.1.2 npm run watch`

**Similar projects**  
[react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit), 
[isomorphic-redux](https://github.com/bananaoomarang/isomorphic-redux), 
[react-redux-isomorphic-hot-boilerplate](https://github.com/inxilpro/react-redux-isomorphic-hot-boilerplate), 
[react-redux-isomorphic-example](https://github.com/coodoo/react-redux-isomorphic-example), 
[redux-universal-app](https://github.com/eriknyk/redux-universal-app)


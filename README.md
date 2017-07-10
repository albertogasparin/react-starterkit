# React starterkit


[![Dependency Status](https://david-dm.org/albertogasparin/react-starterkit.svg?style=flat-square)](https://david-dm.org/albertogasparin/react-starterkit)
[![devDependency Status](https://david-dm.org/albertogasparin/react-starterkit/dev-status.svg?style=flat-square)](https://david-dm.org/albertogasparin/react-starterkit#info=devDependencies)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://albertogasparin.mit-license.org)

Server: Koa, React + router + Redux isomorphic rendering, Marko template streaming  
Client: React + router + Redux, Sass, SVG icons setup



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
Webpack middleware handles all `/assets` requests, while Koa handles all others



## Testing

Tests run with Mocha + Expect for both client and server:
``` sh
npm run test -s
# or
npm run test:unit:watch # for TDD
```
React components testing is done with [Enzyme](https://github.com/airbnb/enzyme/), a library that allows you to use a jQuery-like API to query the virtual dom.

Code coverage reports are also available thanks to [Nyc](https://github.com/bcoe/nyc):
``` sh
npm run coverage
```


## Production

First, build the JS files ()client + server and the CSS files (extracted):
``` sh
npm run build
```

To run node with production env:
``` sh
NODE_ENV=production npm run start
```
Now `127.0.0.1:3000` will serve your entire app.



## ENV variables

You can dynamically change some behaviors of the app by either prepending these props to the shell command or by adding them to a `.env` file. See `.env-example` for supported keys.



## Config variables

We suggest you to add constants and configuration options in `lib/config.js`. 



## Adding API endpoints

To create a set of endpoints (`/api/users` for instance), first add `users/index.js` inside the `./api` folder. Then define your methods (like `list()`, `create()`, ...) and export an object with:  
  - keys: `GET/POST/PUT/DELETE` *space* `name`
  - values: the generator function that will be called by the router

``` js
const API = {
  'GET /todos': list,
  'POST /todos': create,
  'PUT /todos/:id': update,
};
export default API;
```

Then, import that `API` object in `./api/index.js` and combine those routes with the ones already in. 



## Server-side data fetching with Redux 

There is no consolidated way of retrieving resources server-side from a Redux action. We suggest you to provides a third argument to the Redux thunk: an `api` object. You can provide two different modules clientside and serverside, see `./www/all/api.js` and `./app/api.js` for examples.


## How to

**Passing config variables client-side**  
Properties defined under `client` in `./lib/config` are automatically exposed client-side under `CLIENT_CONFIG` global.

**Getting rid of React-router**  
You can easily get rid of it on the client side by removing `react-router` related code. The minified bundle size will be reduced by ~50kB. The router can still be used server-side to provide 404s and redirects.

**Manually (and quickly) restart the server**  
Just type `rs` in the console and press enter. [node-supervisor](https://github.com/petruisfan/node-supervisor) will do the rest.



## Troubleshooting

**Missing CSS while serving the built bundle**  
The external CSS file is loaded by `www/all/templates/index.marko` only if the node env is not `development`.  
Try: `NODE_ENV=test npm run start`



## Useful addons & packages

- [scroll-behavior](https://github.com/rackt/scroll-behavior)  
  Adds scroll behaviors (scroll to top / restore) on route change
- [react-helmet](https://github.com/nfl/react-helmet)  
  Change doc `head` (title, meta, ...) from within components (w/ server-side support)
- [immutable-js](https://github.com/facebook/immutable-js) / [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)  
  Immutable data / helpers
- [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe)  
  Batch redux updates to avoid multiple re-renders



**Similar projects**  
[react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit), 
[isomorphic-redux](https://github.com/bananaoomarang/isomorphic-redux), 
[react-redux-isomorphic-example](https://github.com/coodoo/react-redux-isomorphic-example), 


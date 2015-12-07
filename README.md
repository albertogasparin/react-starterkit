# React starterkit

Server: Koa, React + router rendering, Jade templates
Client: React + router, Sass


## Setup

``` sh
npm install
```


## Development

To start both Node server and Webpack dev server (watching) run:
``` sh
npm run watch
```
The browser entry point while developing is `127.0.0.1:8080`. 
Webpack dev server is configured to proxy requests to node, so it will handle all `/assets` requests itself while all other requests will be handled by Koa (running on port `3000`)


## Testing

Tests are runned with Mocha + Expect for both client and server:
``` sh
npm run test 
# or
npm run test:watch # for TDD
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

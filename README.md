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
Webpack dev server is configured to proxy requests to node, so it will handle all `/assets` requests itself while all other requests will be handled by Koa


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


## ENV variables

You can either prepend these props to the shell command or you can add them to `.env` file.

**NODE_ENV** `string` 
Set node environment: `development`, `test`, `production` (default: `development`)

**PORT** `int` 
Koa node server listening port (default: `3000`)

**WDS_PORT** `int`
Webpack dev server listening port (default: `8080`)


## Troubleshooting

**Missing CSS after building and serving from node**  
The external CSS file is loaded by `index.jade` only if the node env is not `development`. 
Try: `NODE_ENV=test npm run start`



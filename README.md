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


## Testing

Tests are runned with Mocha + Expect for both client and server:
``` sh
npm run test 
# or
npm run test:watch # for TDD
```


## Production

Build the JS file and extract the CSS file:
``` sh
npm run build
```

Run node with production env:
``` sh
NODE_ENV=production npm run start
```

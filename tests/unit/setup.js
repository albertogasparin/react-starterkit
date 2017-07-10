// import chai from 'chai';

// This is where you might want to extend chai
// Remember: mocha env is NOT available here

// enhance require to handle `.marko` files
require('marko/compiler').defaultOptions.writeToDisk = false;
require('marko/node-require');

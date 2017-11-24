// This is where you might want to extend chai + setup tests utils
// Remember: mocha env is NOT available here

// import chai from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Configure Enzyme to work with the correct react version
Enzyme.configure({ adapter: new Adapter() });

// enhance require to handle `.marko` files
require('marko/compiler').defaultOptions.writeToDisk = false;
require('marko/node-require');

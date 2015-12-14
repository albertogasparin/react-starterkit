
import path from 'path';
import requireHacker from 'require-hacker';

import config from './config';

/**
 * Enhance require to better support React env
 * (sadly .babelrc "ignore" does not work)
 */


// Ignore non js extensions
requireHacker.global_hook('ignore extensions', function (pathName, module) {
  if (config.resolve.ignore.test(pathName)) { return ''; }
});


// Add support Webpack-like require() aliasing
requireHacker.resolver(function (pathName, module) {
  for (let alias in config.resolve.alias) {
    if (pathName === alias || pathName.indexOf(alias + '/') === 0) {
      pathName = pathName.substring(alias.length);
      return requireHacker.resolve(path.join(config.resolve.alias[alias], pathName), module);
    }
  }
});

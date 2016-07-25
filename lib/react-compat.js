
import path from 'path';
import requireHacker from 'require-hacker';

import config from './config';

/**
 * Enhance require to better support React env
 * (sadly .babelrc "ignore" does not work)
 */

// expose React required globals
global.__CLIENT__ = false;
global.CONFIG_CLIENT = config.client;


// Ignore non js extensions
// so `import 'style.scss'` does not throw
if (!requireHacker.occupied_file_extensions.has('ignore extensions')) {
  requireHacker.global_hook('ignore extensions', function (pathName, module) {
    if (config.server.resolve.ignore.test(pathName)) { return ''; }
  });
}


// Add support Webpack-like require() aliasing
// so we can eventually provide server-specific modules
requireHacker.resolver(function (pathName, module) {
  for (let alias in config.server.resolve.alias) {
    if (pathName === alias || pathName.indexOf(alias + '/') === 0) {
      pathName = pathName.substring(alias.length);
      try {
        let serverPath = path.join(config.server.resolve.alias[alias], pathName);
        return requireHacker.resolve(serverPath, module);
      } catch (e) {
        let stdPath = path.join(config.webpack.resolve.alias[alias], pathName);
        return requireHacker.resolve(stdPath, module);
      }
    }
  }
});

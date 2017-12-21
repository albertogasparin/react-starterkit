/* eslint-disable no-console */
import chalk from 'chalk';
import _ from 'lodash';

import config from './config';

const logger = {
  info(prefix, title, ...rest) {
    /* istanbul ignore next */
    if (config.env !== 'test') {
      console.info(
        chalk.cyan(_.padStart(prefix, 5)),
        chalk.bold(String(title).toUpperCase()),
        ...rest
      );
    }
    return true;
  },

  error(arg1, ...rest) {
    /* istanbul ignore else */
    if (_.isError(arg1)) {
      let stack =
        arg1.stack
          .split(/\n/)
          .filter((v, i) => i === 0 || v.includes(config.root))
          .map(
            (v, i) =>
              i === 0 && !arg1.status
                ? chalk.bold.red(v)
                : chalk.gray(
                    v
                      .replace(config.root, '.')
                      .replace('server_build/webpack:/', '') // fix source map path
                  )
          )
          .join('\n  ') + '\n';
      if (arg1.status) {
        return this.info('', 'ERR', stack, ...rest);
      }
      arg1 = stack;
    }

    console.error(arg1, ...rest);
    return true;
  },
};

export default logger;

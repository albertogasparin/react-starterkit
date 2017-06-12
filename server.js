/* eslint-disable no-console */
import config from './lib/config';
import app from './lib/index';

/**
 * Increase stackTrace limit
 */
Error.stackTraceLimit = 50;

/*
 * Start the app
 */

app.listen(config.port);

console.log('\x1b[33mServer [%s] started on http://%s:%s/\x1b[0m',
  config.env, config.host, config.port);

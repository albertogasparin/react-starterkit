import onError from 'koa-onerror';
import createError from 'http-errors';

export default function setup (app) {

  // 404 handling (as onError ignores it by default)
  app.use(async ({ response }, next) => {
    await next();
    /* istanbul ignore else */
    if (response.status >= 400) {
      throw createError(response.status, response.message);
    }
  });

  // global error handling
  onError(app, {
    html (error) {
      this.renderSync(__dirname, 'error', {
        error,
        status: this.status,
      });
    },
  });
}

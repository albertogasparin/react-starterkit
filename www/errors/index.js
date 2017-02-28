import onError from 'koa-onerror';

export default function setup (app) {

  // 404 handling (as onError ignores it by default)
  app.use(function *(next) {
    yield next;
    /* istanbul ignore else */
    if (this.status >= 400) {
      this.throw(this.status, this.response.message);
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


import { router } from '../../api';

async function runRouterHandler (originalRequest, path, params, body) {
  path = router.opts.prefix + path;
  // we create a fake context (instead of using app.createContext)
  // so we avoid stingify and parsing objects
  // however cookies and many ctx methods are currently not implemented
  let ctx = {
    set () {},
    path,
    params,
    method: 'GET',
    request: { url: path, params, body },
    response: {},
  };

  await router.routes()(ctx, () => {});
  return ctx.response.body;
}

export async function get (path, options = {}) {
  let body = await runRouterHandler(this.req, path, options.params, options.data);
  return body;
}

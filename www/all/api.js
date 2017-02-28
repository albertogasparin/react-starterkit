
import co from 'co';

import { router } from '../../api';

const baseUrl = '/api';

export function get (path, options = {}) {
  return co(function *() {
    let ctx = {
      request: { params: options.params, body: options.data },
      response: {},
    };
    let [ route ] = router.match(baseUrl + path, 'GET').pathAndMethod;
    yield route.stack[0].call(ctx);
    return ctx.response.body;
  });
}

import routesApi from '../api';
import routesWww from '../www';

export default function(app) {
  // setup /api routes matching
  routesApi(app);

  // non-api routes matching
  routesWww(app);
}

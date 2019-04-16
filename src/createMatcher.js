import pathToRegexp from "path-to-regexp";
import * as _ from "./util";
function createRoute(route) {
  let finalRoute = _.extend({}, route);
  let keys = (finalRoute.keys = []);
  finalRoute.regexp = pathToRegexp(finalRoute.path, keys);
  return finalRoute;
}
export default function createMatcher(routes) {
  const finalRoutes = routes.map(createRoute);
  const routeLength = finalRoutes.length;
  return function matcher(pathename) {
    let finalPathname = cleanPath(pathname);
    for (let i = 0; i < routeLength; i++) {
      let route = finalRoutes[i];
      let matches = route.regexp.exec(finalPathname);
      if (!matches) {
        continue;
      }
      let params = getParams(matches, route.keys);
      let controller = route.controller;
      return {
        path: route.path,
        params,
        controller
      };
    }
  };
}

function cleanPath(path) {
  return path.replace(/\/\//g, "/");
}

function getParams(matches, keys) {
  let params = {};
  for (let i = 1, len = matches.length; i < len; i++) {
    let key = keys[i - 1];
    if (key) {
      if (typeof matches[i] === "string") {
        params[key.name] = decodeURIComponent(matches[i]);
      } else {
        params[key.name] = matches[i];
      }
    }
  }
  return params;
}

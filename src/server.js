import * as _ from "./util";
import { defaultAppSettings } from "./constant";
const render = html => html.toString();

function createHistory(settings) {
  let create = create;
}

export default function createApp(appSettings) {
  let finalAppSettings = _.extend({ viewEngine: render }, defaultAppSettings);
  
  _.extend(finalAppSettings, appSettings);
  
  let { routes, viewEngine, loader, context } = finalAppSettings;
  
  context = {
    ...finalAppSettings.context,
    ...appSettings.context
  };
  let matcher = createMatcher(routes);
  let history = createHistory(finalAppSettings);

  function render(requestPath, injectContext, callback) {
    let result = null;

    if (typeof injectContext === "function") {
      callback = injectContext;
      injectContext = null;
    }
    try {
      result = initController(fetchController(requestPath, injectContext));
    } catch (error) {
      callback && callback(error);
      return Promise.reject(error);
    }
    if (_.isThenable(result)) {
      if (callback) {
        result.then(result => callback(null, result), callback);
      }
      return result;
    }
    callback && callback(null, result);
    return result;
  }
  function initController(controller) {
    if (_.isThenable(controller)) {
      return controller.then(initController);
    }
    let component = controller.init();
    if (component === null) {
      return { controller };
    }
    if (_.isThenable(component)) {
      return component.then(component => {
        if (component == null) {
          return { controller };
        }
        let content = renderToString(component);
        return { content, controller };
      });
    }
    let content = renderToString(component);
    return { content, controller };
  }
  function fetchController(requestPath, injectContext) {
    let location = history.createLocation(requestPath);
    let matches = matcher(location.pathname);
    if (!matches) {
      let error = new Error(`Did not match any route with path:${requestPath}`);
      error.status = 404;
      return Promise.reject(error);
    }
    let { path, params, controller } = matches;
    location.pattern = path;
    location.params = params;
    location.raw = requestPath;

    let finalContext = {
      ...context,
      ...injectContext
    };

    let Controller = loader(controller, location, finalContext);
    if (_.isThenable(Controller)) {
      return Controller.then(Controller => {
        let Wrapper = wrapController(Controller);
        return new Wrapper(location, finalContext);
      });
    }
    let Wrapper = wrapController(Controller);
    return new Wrapper(location, finalContext);
  }

  let controllers = _.createMap();
  function wrapController(Controller) {
    if (controllers.has(Controller)) {
      return controllers.get(Controller);
    }
    class WrapperController extends Controller {
      constructor(location, context) {
        super(location, context);
        this.location = this.location || location;
        this.context = this.context || context;
        this.matcher = matcher;
        this.loader = loader;
        this.routes = routes;
      }
    }
    controllers.set(Controller, WrapperController);
    return WrapperController;
  }
  function renderToString(component) {
    return viewEngine.render(component);
  }
  return {
    render,
    history
  };
}

function createHistory(settings) {
  let create = createMemoryHistory;
  if (settings.basename) {
    create = History.useBasename(create);
  }
  create = History.useQueries(create);
  return create(settings);
}

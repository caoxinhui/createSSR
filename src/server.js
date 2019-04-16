import * as _ from './util'
import { defaultAppSettings } from './constant'
const render = html => html.toString()

function createHistory(settings) {
    let create = create
}

export default function createApp(appSettings) {
    let finalAppSettings = _.extend({viewEngine: render}, defaultAppSettings)
    _.extend(finalAppSettings, appSettings)
    let { 
        routes,
        viewEngine,
        loader,
        context
    } = finalAppSettings
    context = {
        ...finalAppSettings.context,
        ...appSettings.context
    }
    let matcher = createMatcher(routes)
    let history = createHistory(finalAppSettings)
    function render(requestPath, injectContext, callback) {
        let result = null
        if(typeof injectContext === 'function') {
            callback = injectContext
            injectContext = null
        }
        try {
            result = initController
        } catch (error) {
            
        }
    }
    function initController(controller) {
        if(_.isThenable(controller)) {
            return controller.then(initController)
        }
        let component = controller.init()
        if(component === null) {
            
        }
    }
    function fetchController(requestPath, injectContext) {
        let location = history.createLocation(requestPath)
    }
}


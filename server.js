import http from 'http'
import fs from 'fs'
import path from 'path'
import createApp from './src/server'
import { renderToString } from 'react-dom/server'
import routes from './src/routes'

let appSettings = {
    basename: '/examples/simple-spa',
    viewEngine: {
        render: renderToString
    },
    loader: module => module.default || module,
    routes: routes
}

let app = createApp(appSettings)
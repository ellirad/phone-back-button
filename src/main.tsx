import { registerSW } from 'virtual:pwa-register'
import ReactDOM from 'react-dom/client'
import React from 'react'

import {BackStackProvider} from "./backStack";
import App from './App'
import './index.css'

registerSW({
    onNeedRefresh() {
        console.log('New version available')
    },
    onOfflineReady() {
        console.log('App ready to work offline')
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BackStackProvider>
            <App />
        </BackStackProvider>
    </React.StrictMode>
)

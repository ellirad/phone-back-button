import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import {BackStackProvider} from "./backStack";

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

// Entry point: mounts <App /> into the #root div in index.html, wrapped in the router (BrowserRouter).
// also loads the one global stylesheet, src/styles/site.css. nothing to tweak here.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/site.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

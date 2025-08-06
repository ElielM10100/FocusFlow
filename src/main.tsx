import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'
import './index.css'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento "root" não encontrado no documento.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

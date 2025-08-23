import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { loadRuntimeConfig } from './lib/runtimeConfig';
import { setRuntimeCfg } from './lib/api';

loadRuntimeConfig().then(cfg => {
  setRuntimeCfg(cfg);
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.tsx'
import { Provider } from "react-redux";
import { store } from "@/store/index";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

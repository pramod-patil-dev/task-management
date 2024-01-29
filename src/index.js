import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./index.css";
import App from "./App";
import { RecoilRoot } from "recoil";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.min.css";

ReactDOM.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);
reportWebVitals();
serviceWorkerRegistration.register();

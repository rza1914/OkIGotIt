import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { loadRuntimeConfig } from "./lib/runtimeConfig";
import { setRuntimeCfg } from "./lib/api";
import ClickInspector from "./dev/ClickInspector";

loadRuntimeConfig().then(cfg => {
  setRuntimeCfg(cfg);
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      {/* فقط برای دیباگ، آخر کار حذف می‌شود */}
      <ClickInspector />
      <App />
    </BrowserRouter>
  );
});
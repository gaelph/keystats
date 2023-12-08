import React from "react";
import ReactDOM from "react-dom/client";

import "@picocss/pico/css/pico.slim.min.css";
import "~/index.css";
import "~/style/button-group.css";

import App from "~/App.js";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

/*
 * This is for hot-reload and live css reloading
 * It is removed on production builds
 */
// eslint-disable-next-line
DEV: new EventSource("/esbuild").addEventListener("change", (event) => {
  const { added, removed, updated } = JSON.parse(event.data);

  if (!added.length && !removed.length && updated.length === 1) {
    for (const link of document.getElementsByTagName("link")) {
      const url = new URL(link.href);

      if (url.host === window.location.host && url.pathname === updated[0]) {
        const next = link.cloneNode() as HTMLLinkElement;
        next.href = updated[0] + "?" + Math.random().toString(36).slice(2);
        next.onload = () => link.remove();
        if (link.parentNode) {
          link.parentNode.insertBefore(next, link.nextSibling);
        }
        return;
      }
    }
  }

  window.location.reload();
});

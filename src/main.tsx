import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Check if we're in a browser environment
const rootElement = document.getElementById("root");
if (rootElement) {
  hydrateRoot(
    rootElement,   
      <App />
  );
}

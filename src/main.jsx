import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store/store.js";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={1000}
      >
        <App />
      </SnackbarProvider>
    </Provider>

);

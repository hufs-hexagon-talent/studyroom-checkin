import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SnackbarProvider from "react-simple-snackbar";
import "./index.css";
import Router from "./router";

export const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <HashRouter>
          <Router />
        </HashRouter>
      </SnackbarProvider>
    </QueryClientProvider>
  </RecoilRoot>
);

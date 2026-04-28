import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/landing-page";
import { Login } from "./components/login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "*",
    Component: LandingPage,
  },
]);

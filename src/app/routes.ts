import { createBrowserRouter } from "react-router";
import { VitrineLayout } from "./components/vitrine/vitrine-layout";
import { VitrineHome } from "./components/vitrine/home";
import { LandingPage } from "./components/landing-page";
import { NotFound } from "./components/vitrine/not-found";
import { Login } from "./components/login";
import { Signup } from "./components/signup";
import { ForgotPassword } from "./components/forgot-password";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: VitrineLayout,
    children: [
      { index: true, Component: VitrineHome },
      { path: "landing", Component: LandingPage },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "*", Component: NotFound },
]);

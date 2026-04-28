import { createBrowserRouter } from "react-router";
import { VitrineLayout } from "./components/vitrine/vitrine-layout";
import { VitrineHome } from "./components/vitrine/home";
import { Login } from "./components/auth/login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: VitrineLayout,
    children: [
      { index: true, Component: VitrineHome },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Page non trouvée</p>
          <a href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Retour à l'accueil
          </a>
        </div>
      </div>
    ),
  },
]);

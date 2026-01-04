import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import routes from "../utils/routes";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      { index: true, element: routes.main.element },
      // { path: routes.admin.path, element: <ProtectedRoute>{routes.admin.element}</ProtectedRoute> },
      { path: routes.dashboard.path, element: <ProtectedRoute>{routes.dashboard.element}</ProtectedRoute> },
      { path: routes.contact.path, element:routes.contact.element },
      { path: routes.email.path, element:routes.email.element },
      { path: routes.games.path, element:routes.games.element },
      { path: routes.slots.path, element: <ProtectedRoute>{routes.slots.element}</ProtectedRoute> },
      { path: routes.roulette.path, element:<ProtectedRoute>{routes.roulette.element}</ProtectedRoute> },
      { path: routes.oauth.path, element: routes.oauth.element },
      { path: routes.terms.path, element: routes.terms.element },
    ]
  }
])

export default router
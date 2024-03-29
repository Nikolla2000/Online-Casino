import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import routes from "../utils/routes";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      { index: true, element: routes.main.element },
      { path: routes.admin.path, element:routes.admin.element },
      { path: routes.dashboard.path, element:routes.dashboard.element },
      { path: routes.contact.path, element:routes.contact.element },
      { path: routes.email.path, element:routes.email.element },
      { path: routes.games.path, element:routes.games.element },
      { path: routes.slots.path, element:routes.slots.element },
      { path: routes.roulette.path, element:routes.roulette.element },
    ]
  }
])

export default router
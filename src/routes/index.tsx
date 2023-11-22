import {
  BrowserRouter as Router,
  Routes as ReactRouterRoutes,
  Route,
} from "react-router-dom"
import { useAuth } from "../providers/auth"
import { ProtectedRoute } from "./ProtectedRoute"
import Login from "../pages/login/Login"
import Landing from "../pages/landing/Landing"
import Dashboard from "../pages/dashboard/Dashboard"
import SharedFolder from "../pages/shared/SharedFolder"
import SharedFile from "../pages/shared/SharedFile"
import Page404 from "../pages/404/404"
import Header from "../components/header/Header"

const Routes: React.FC = () => {
  const { user, token } = useAuth()

  const routesForAuthenticated = [
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
      ],
    },
  ]

  const routesForNotAuthenticated = [
    {
      path: "",
      element: <Login />,
    },
    {
      path: "/landing",
      element: <Landing />,
    },
  ]

  const routesForAll = [
    {
      path: "/shared/folders/:id",
      element: <SharedFolder />,
    },
    {
      path: "/shared/files/:id",
      element: <SharedFile />,
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ]

  return (
    <Router>
      <ReactRouterRoutes>
        {
          routesForAll.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))
        }
        {!token &&
          routesForNotAuthenticated.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        {token &&
          routesForAuthenticated.map((route, index) => (
            <Route key={index} path={route.path} element={route.element}>
              {route.children &&
                route.children.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
            </Route>
          ))}
      </ReactRouterRoutes>
      <Header token={token} user={user} />
    </Router>
  )
}

export default Routes
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import routes from "./routes";

const Index = () => {
  return (
    <>
      <Router>
        <Routes>
          {routes.map((route, key) => {
            return (
              <Route
                key={key}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute>{route.component}</ProtectedRoute>
                  ) : (
                    <GuestRoute>{route.component}</GuestRoute>
                  )
                }
              />
            );
          })}
        </Routes>
      </Router>
    </>
  );
};

const ProtectedRoute: React.FC = ({ children }) => {
  const [token, setToken] = React.useState(
    window.localStorage.getItem("token")
  );
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  });
  return <>{children}</>;
};

const GuestRoute: React.FC = ({ children }) => {
  return <>{children}</>;
};

export default Index;

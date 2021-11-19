import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

type TPage = {
  path: string;
  component: React.ReactNode;
  protected: boolean;
};

const routes: Array<TPage> = [
  {
    path: "/",
    component: <Dashboard />,
    protected: false, // TODO: Change it to true
  },
  {
    path: "/login",
    component: <Login />,
    protected: false,
  },
];

export default routes;

import type { MetaFunction } from "remix";
import { Link } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Homepage",
    description: "Welcome to Admin Jastip!",
  };
};

const Index: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-4 text-gray-500 font-light">Admin Jastip</h1>
      <Link to="/login" className="text-white px-8 py-2 bg-black rounded-md">
        Login
      </Link>
    </div>
  );
};

export default Index;

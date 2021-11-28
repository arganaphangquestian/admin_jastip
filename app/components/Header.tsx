import React from "react";
import { Link, useLocation } from "remix";

type Props = {};

const Header: React.FC<Props> = () => {
  let navigation = useLocation();
  return (
    <div className="px-8 py-4 rounded-md bg-gray-900 text-gray-200 mb-4 flex justify-between items-center">
      <nav>
        {["Transfer", "Withdraw"].map((menu, key) => (
          <Link
            key={key}
            to={`/${menu.toLowerCase()}`}
            className={
              "mr-2 last:mr-0 px-4 py-2 rounded-full " +
              `${
                "/" + menu.toLowerCase() === navigation.pathname
                  ? "bg-gray-50 text-gray-800"
                  : ""
              }`
            }
          >
            {menu}
          </Link>
        ))}
      </nav>
      <form action="/logout" method="post">
        <button
          type="submit"
          className="border rounded-md border-gray-400 px-4 py-1"
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default Header;

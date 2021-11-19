import React from "react";
import style from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <div className={style.Navbar}>
      <Avatar name="Argana Phangquestian" />
    </div>
  );
};

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className={style.Avatar}>
      <p aria-label={name}>
        {name
          .split(" ")
          .map((word) => word.split("")[0])
          .slice(0, 2)
          .join("")}
      </p>
    </div>
  );
};

export default Navbar;

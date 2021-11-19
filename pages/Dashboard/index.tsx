import React from "react";
import Navbar from "./components/Navbar";
import style from "./index.module.scss";

const Index: React.FC = () => {
  return (
    <div className={style.Layout}>
      <Navbar />
      <div className={style.Container}>
        <h1>Hello World from Dashboard</h1>
      </div>
    </div>
  );
};

export default Index;

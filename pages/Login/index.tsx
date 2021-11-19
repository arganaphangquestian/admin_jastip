import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import style from "./index.module.scss";

type LoginData = {
  email: string;
  password: string;
};

const Index: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginData>();

  const onHandleSubmit: SubmitHandler<LoginData> = (data) => {
    console.log(data);
  };

  return (
    <div className={style.Container}>
      <form onSubmit={handleSubmit(onHandleSubmit)} className={style.Form}>
        <div className={style.InputField}>
          <input
            className={style.Input}
            type="text"
            placeholder="Email"
            {...register("email")}
          />
        </div>
        <div className={style.InputField}>
          <input
            className={style.Input}
            type="password"
            placeholder="********"
            {...register("password")}
          />
        </div>
        <button className={style.Button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Index;

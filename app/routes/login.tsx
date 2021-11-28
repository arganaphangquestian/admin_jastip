import React from "react";
import { Form, redirect } from "remix";
import { createUserSession, getUser, login } from "~/utils/session.server";
import type { MetaFunction, ActionFunction, LoaderFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Homepage",
    description: "Welcome to Admin Jastip!",
  };
};

type ActionData = {
  formError?: string;
  fields?: {
    email: string;
    password: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  let user = await getUser(request);
  if (user) {
    return redirect("/dashboard");
  }
  return null;
};

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/dashboard";
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return { formError: `Form not submitted correctly.` };
  }
  let fields = { email, password };
  const user = await login({ ...fields });
  if (!user) {
    return {
      fields,
      formError: `Email/Password combination is incorrect`,
    };
  }
  return createUserSession(user, redirectTo);
};

const Index: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <Form method="post" className="max-w-xl flex flex-col justify-center">
        <div className="flex flex-col mb-4">
          <input
            type="text"
            name="email"
            placeholder="johndoe@mail.com"
            defaultValue="johndoe@mail.com"
            className="bg-transparent outline-none border-2 rounded-md px-8 py-4 border-gray-700"
          />
        </div>
        <div className="flex flex-col mb-4">
          <input
            type="password"
            name="password"
            placeholder="********"
            defaultValue="password"
            className="bg-transparent outline-none border-2 rounded-md px-8 py-4 border-gray-700"
          />
        </div>
        <button
          type="submit"
          className="text-white px-8 py-4 bg-black rounded-md"
        >
          Login
        </button>
      </Form>
    </div>
  );
};

export default Index;

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

const Login = () => {

  const router = useRouter();

  const [message, setMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    const { user, password } = data;
    axios
      .post(
        "http://localhost:5000/login",
        { user, password },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        const {
          data: { error, success},
        } = res;
        if(success){
          return router.push('/')
        }
        error && setMessage(error);
      });
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      {message && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 w-full rounded lg:max-w-xl mx-auto mb-[30px]"
          role="alert"
        >
          <strong className="font-bold">Alerta! </strong>
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      <div className="w-full p-6 mx-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Iniciar Sesión
        </h1>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label
              id="user"
              className="block text-sm font-semibold text-gray-800"
            >
              Usuario
            </label>
            <input
              type="user"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              {...register("user", { required: true })}
            />
          </div>
          <div className="mb-2">
            <label
              id="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Contraseña
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              {...register("password", { required: true })}
            />
          </div>
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
              Entrar
            </button>
          </div>
        </form>
        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Ya tenes una cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-purple-600 hover:underline"
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

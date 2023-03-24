import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { FieldValues } from "react-hook-form/dist/types";
import { useRouter } from 'next/router'
import Link from "next/link";
import { toast } from "react-toastify";

const Register = () => {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data: FieldValues) => {
    const { user, password} = data
    await axios.post("http://localhost:5000/registro", {user, password})
      .then((res)=>{
        toast.success("Registrado exitosamente")
        console.log(res)
        router.push('/login')
      })
      .catch((err)=>{
        console.log(err)
      })
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Registrarse
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
              {...register("user", {
                required: true,
                minLength: 4,
                maxLength: 20,
              })}
            />
            {errors.user?.type === "required" && <p className="text-red-500">Introduzca un usuario</p>}
            {errors.user?.type === "minLength" && (
              <p className="text-red-500">El usuario tiene que tener mas de 4 caracteres</p>
            )}
            {errors.user?.type === "maxLength" && (
              <p className="text-red-500">El usuario tiene que tener menos de 20 caracteres</p>
            )}
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
              {...register("password", {
                required: true,
                minLength: 5,
                maxLength: 40,
              })}
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">Introduzca una contraseña</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">La contraseña tiene que tener mas de 5 caracteres</p>
            )}
            {errors.password?.type === "maxLength" && (
              <p className="text-red-500">La contraseña tiene que tener menos de 40 caracteres</p>
            )}
          </div>
          <div className="mb-2">
            <label
              id="confirmPassword"
              className="block text-sm font-semibold text-gray-800"
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              {...register("confirmPassword", {
                validate: (value, values) => value === values.password,
              })}
            />
            {errors.confirmPassword?.type === "validate" && (
              <p className="text-red-500">Las contraseñas no coinciden</p>
            )}
          </div>
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
              Crear cuenta
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Ya tenes una cuenta?{" "}
          <Link href="/login" className="font-medium text-purple-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

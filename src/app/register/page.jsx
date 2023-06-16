"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
      toast.error("Todos los coampos son obligatorios");
      return;
    }
  
    if (password.length < 6) {
      toast.error("La contraseña debe tener mas de 6 caracteres");
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no son iguales");
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,3})$/;
    if (!emailRegex.test(email)) {
      toast.error("Formato invalido de email");
      return;
    }
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_REGISTER_URL}/api/register`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        }
      );
  
      if (res.ok) {
        toast.success("Usuario registrado con éxito");
        setTimeout(() => {
          signIn();
        }, 1500);
        return;
      } else {
        toast.error("El usuario ya existe");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-12">
      <form onSubmit={handleSubmit}>
        <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px ">
          <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12 ">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 ">
                Signin to your account
              </h1>
              <p className="text-sm tracking-wide text-gray-600 ">
                Do you have an account ?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 transition duration-200 hover:underline "
                >
                  LogIn
                </Link>
              </p>
            </div>

            <div className="mt-8 space-y-8">
              <div className="space-y-6">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
                  placeholder="escribe tu nombre"
                  type="text"
                  name="username"
                  id="text"
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
                  placeholder="escribe un email"
                  type="email"
                  name="email"
                  id="email"
                />

                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
                  placeholder="ingresa un contraseña"
                  type="password"
                  name="password"
                  id="password"
                />
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
                  placeholder="comfirmar contraseña"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                />
              </div>
              <button
                className={
                  "h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white"
                }
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;

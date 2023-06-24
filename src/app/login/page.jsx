"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { BsGoogle } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { signIn, useSession, getSession } from "next-auth/react";
import AuthSocialButton from "../components/AuthSocialButton";
import LoadingModal from "../components/modals/LoadingModal";
import redirectAuthenticate from '../hooks/redirectAuthenticate.js'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if(redirectAuthenticate(status, router)) return;
    
    setIsLoadingPage(false);
  }, [router, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === "" || email === "") {
      toast.error("Fill all fields!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error == null) {
        router.push("/");
      } else {
        toast.error("Error occured while logging");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const socialAction = async (provider) => {
    setIsLoading(true);

    await signIn(provider, { redirect: true })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      {isLoadingPage ? (
        <LoadingModal />
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-white p-12">
          <form onSubmit={handleSubmit}>
            <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px ">
              <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12 ">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800 ">
                    Signin to your account
                  </h1>
                  <p className="text-sm tracking-wide text-gray-600 ">
                    Don&apos;t have an account ?{" "}
                    <Link
                      href="/register"
                      className="text-blue-600 transition duration-200 hover:underline "
                    >
                      Signup
                    </Link>
                  </p>
                </div>

                <div className="mt-8 space-y-8">
                  <div className="space-y-6">
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
                      placeholder="Your Email"
                      type="email"
                      name="email"
                      id="email"
                    />

                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
                      placeholder="Your Password"
                      type="password"
                      name="password"
                      id="password"
                    />
                  </div>

                  <button className="h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white">
                    Signin
                  </button>
                </div>
                <AuthSocialButton
                  icon={BsGoogle}
                  onClick={() => socialAction("google")}
                />
              </div>
            </div>
          </form>
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default Login;

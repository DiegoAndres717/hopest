"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../../public/images/logo.jpg";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  
  const currentPath = usePathname();
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link className="/" href={"/"}>
          <Image
            className="rounded-full"
            src={logo}
            width={50}
            height={50}
            alt="Logo"
            blurDataURL={logo}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>
      <div className="navbar-center">
        <a className="text-yellow-300 font-bold font-mono normal-case text-2xl">
          <span className="text-yellow-400 font-extrabold text-4xl">H</span>
          opest
        </a>
      </div>
      <div className="navbar-end">
        {session?.user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Image
                className="rounded-full"
                src={`${session?.user?.image || '/login.webp'}`}
                width={50}
                height={50}
                alt="Logo"
              />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40 z-50"
            >
              <li>
                <Link href={"/"}>Homepage</Link>
              </li>
              <li>
                <Link href={"/perfil"}>Perfil</Link>
              </li>
              <li>
                <Link href={"/create-blog"}>Crear Blog</Link>
              </li>
              <li>
                <Link
                  href={"/"}
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            {currentPath !== "/register" && (
              <Link href={"/register"}>
                <button className="btn btn-warning">Register</button>
              </Link>
            )}
            {currentPath !== "/login" && (
              <button onClick={()=> window.location.replace('/login')} className="btn btn-success mx-4">
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

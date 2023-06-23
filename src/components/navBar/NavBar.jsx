"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.jpg";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
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
          <div className="flex justify-end w-full text-center mx-auto">
            {currentPath !== "/register" && (
              <Link href={"/register"}>
                <button className="btn btn-warning text-xs sm:text-lg h-12 p-1 mr-1 capitalize">Registrarse</button>
              </Link>
            )}
            {currentPath !== "/login" && (
              <button onClick={()=> router.push('/login')} className="btn btn-success text-xs sm:text-lg h-12 p-2 capitalize">
                Ingresar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

import { Inter } from "next/font/google";
import Provider from "@/Provider";
import Loading from "./loading";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog",
  description: "Generated by create next app",
};

export default function BlogLayout({children}) {
  return (
      <section className={inter.className}>
        <>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </>
      </section>
  );
}

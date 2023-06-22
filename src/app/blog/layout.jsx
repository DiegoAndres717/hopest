import { Inter } from "next/font/google";

import Loading from "./loading";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function BlogLayout({ children }) {
  return (
    <section className={inter.className}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </section>
  );
}

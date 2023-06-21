
import NavBar from "@/components/navBar/NavBar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/footer/Footer";
import Provider from "@/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hopest",
  description: "App creada para los estudiantes que necesitan un alojamiento o pension",
};

export default function RootLayout({ children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <NavBar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}

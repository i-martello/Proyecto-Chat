import "@/styles/globals.css";
import axios from "axios";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const res = await axios.get("http://localhost:5000/validate", {
        withCredentials: true,
      });
      if (res.data.msg) {
        console.log(res.data.msg);
        if (router.pathname !== "/register") {
          router.push("/login");
          return;
        }
        return;
      }
    })();
  }, []);
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}



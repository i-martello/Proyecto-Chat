import axios from "axios";
import React, { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import io from "socket.io-client";
import { useRouter } from "next/router";

const socket = io("http://localhost:5000");

interface TypeMessages {
  user: string;
  message: string;
}

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [img, setImg] = useState("");
  const [message, setMessage] = useState<string>("");
  const [lastMessage, setLastMessage] = useState<TypeMessages>();
  const [messages, setMessages] = useState([]);

  useEffect(() => {

    const receiveMessages = (msg: any) => {
      setMessages(msg);
    }

    socket.on("message", receiveMessages);

    (async () => {
      const res = await axios.get("http://localhost:5000/validate", {
        withCredentials: true,
      });
      setImg(res.data.decodedToken?.img);
      setUser(res.data.decodedToken?.user);
    })();
    setLastMessage([...messages].pop()!);

    return () => {
      socket.off("message", receiveMessages);
    }

  }, [messages]);

  useEffect(() => {
    (async () => {
      const mensajes = await axios.get("http://localhost:5000/chat");
      setMessages(mensajes.data);
    })();
  },[]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("message", { message, user });
    setMessage("");
  };

  const logout = async () => {
    googleLogout();
    const res = await axios.get("http://localhost:5000/logout", {
      withCredentials: true,
    });
    if (res.data.success) {
      router.push("/login");
    }
  };

  return (
    <>
      <div className=" flex flex-col shadow-lg rounded-lg h-screen">
        <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
          <div className="font-semibold text-2xl mr-[10%]">Chat Proyecto</div>
          <div className="w-1/2">
            <input
              type="text"
              name=""
              id=""
              placeholder="Buscar"
              className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
            />
          </div>
          <button
            className="text-gray-900 bg-white border border-black focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg px-5 py-2.5 mr-2  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
          <div className="flex items-center">
            <label className="">{user}</label>
            <div className="h-12 w-12 p-2 flex items-center justify-center">
              <img
                className="rounded-full"
                src={
                  img ||
                  "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png"
                }
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between bg-transparent  h-full">
          <div className="flex flex-col w-2/5 bg-white  border-r-2 overflow-y-auto">
            <div className="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="Buscar chat"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              />
            </div>
            <div className="flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400">
              <div className="w-1/4">
                <img
                  src="https://www.pixartprinting.es/blog/wp-content/uploads/2022/11/linguaggi_programmazione.jpg"
                  className="object-cover h-12 w-12 rounded-full"
                  alt=""
                />
              </div>
              <div className="w-full">
                <div className="text-lg font-semibold">
                  Grupo de Programación
                </div>
                <span className="text-gray-500">
                  {lastMessage ? (
                    <span>
                      {lastMessage.user}: {lastMessage.message}
                    </span>
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-[90vh] px-5 flex flex-col justify-between">
            <div className="SCROLLCSS flex flex-col-reverse mt-5 overflow-y-auto">
              {messages.map((message: any, index) => {
                return (
                  <div
                    key={index}
                    className={
                      message.user === user
                        ? "flex justify-end mb-4"
                        : "flex justify-start mb-4"
                    }
                  >
                    <div
                      className={`mr-2 py-3 px-4 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white ${
                        message.user === user ? "bg-blue-400" : "bg-gray-400"
                      }`}
                    >
                      {message.user}: {message.message}
                    </div>
                    <img
                      src={
                        img ||
                        "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_640.png"
                      }
                      className="object-cover h-8 w-8 rounded-full"
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="py-5 flex">
                <input
                  className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                  type="text"
                  placeholder="Escribí tus mensajes aca!"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                <input
                  type="submit"
                  className="text-gray-900 m-2 cursor-pointer bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  value="Enviar"
                />
              </div>
            </form>
          </div>
          <div className="w-2/5 bg-white border-l-2 px-5">
            <div className="flex flex-col">
              <div className="font-semibold text-xl py-4">
                Grupo de Programación
              </div>
              <img
                src="https://www.pixartprinting.es/blog/wp-content/uploads/2022/11/linguaggi_programmazione.jpg"
                className="object-cover rounded-xl h-64"
                alt=""
              />
              <div className="font-semibold py-4">Creado el 21/12/2022</div>
              <div className="font-light"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

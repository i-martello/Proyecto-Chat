import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/router";

interface MyToken {
  name: string;
  picture: string;
  // whatever else is in the JWT.
}

const Google = () => {
  const router = useRouter();

  const onSuccess = async (res: any) => {
    console.log(res);
    const decodeCredential = jwt_decode<MyToken>(res.credential);

    const resAxios = await axios.post(
      "http://localhost:5000/login",
      { googleUser: decodeCredential.name, img: decodeCredential.picture },
      { withCredentials: true }
    );

    if (resAxios.data.success) {
      router.push("/");
    }
  };

  const onFailure = () => {
    console.log("error");
  };

  return (
    <div>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure} />
    </div>
  );
};

export default Google;

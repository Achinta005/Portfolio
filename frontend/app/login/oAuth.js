'use client'
import React from 'react'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import { setAuthToken,getAuthToken } from "../lib/auth";
import Image from 'next/image';

export default function OAuth(){

//extracting token from params and store it as a token in localStorage
const searchParams = useSearchParams();
const router = useRouter();

useEffect(() => {
  const run = async () => {
    console.log("useEffect is running");

    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl && tokenFromUrl.split(".").length === 3) {
      setAuthToken(tokenFromUrl);
    }

    const token = getAuthToken();
    if (!token || token.split(".").length !== 3) {
      console.warn("Invalid or missing token:", token);
      return;
    }
    router.push("/admin")
  };

  run();
}, [searchParams, router]);

 
  const handleLogin=()=>{
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  }
 
  return (
    <div>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium dark:text-white bg-gray-300 dark:bg-blue-600 hover:bg-gray-400 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed h-9"
          onClick={handleLogin}
        >
          <Image
            src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755345764/icons8-google-144_mqwd4m.png"
            alt="Google logo"
            width={22}
            height={30}
            priority
            className="relative left-[-10px]"
          />
          Sign in with Google
        </button>
    </div>
  )
}
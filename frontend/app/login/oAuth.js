"use client";
import React from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { setAuthToken, getAuthToken } from "../lib/auth";
import Image from "next/image";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";
import { cn } from "../lib/util";

export default function OAuth() {
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
      router.push("/admin");
    };

    run();
  }, [searchParams, router]);

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div>
      <button
        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md  px-4 font-medium text-black bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
        type="submit" onClick={handleLogin}
      >
        <div className="ml-36 flex gap-1.5">
        <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
        <span className="text-sm text-neutral-300">
          Google
        </span>
        </div>
        <BottomGradient />
      </button>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

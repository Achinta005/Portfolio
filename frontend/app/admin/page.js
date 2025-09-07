"use client";
import React from "react";
import AdminPage from "./HeroSection/admin";
import Header from "@/components/Navbar";
import useIsMobile from "@/components/useIsMobile";
import AdminPageMobile from "./HeroSection/adminMobile";

const page = () => {
const  isMobile=useIsMobile(1024);
  return isMobile?(<>
      <AdminPageMobile />
      <Header/>
    </>): (
    <>
      <AdminPage />
      <Header/>
    </>
  );
};

export default page;

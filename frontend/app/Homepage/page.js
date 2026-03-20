"use client";

import React, { Suspense } from "react";
import Herosection from './HeroSection/Herosection';

const Page = () => {
  return (
    <Suspense fallback={null}>
      <Herosection />
    </Suspense>
  );
};

export default Page;

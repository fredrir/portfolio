"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const CV = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the PDF file in the public directory
    router.push("/CV_Fredrik_Hansteen_En.pdf");
  }, [router]);

  return null;
};

export default CV;

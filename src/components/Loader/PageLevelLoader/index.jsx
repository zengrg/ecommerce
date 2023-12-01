"use client";

import { FadeLoader } from "react-spinners";

export default function PageLevelLoader({loading}) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FadeLoader 
        color="#000000"
        loading={loading}
        size={30}
        data-testid="loader"
      />
    </div>
  );
}
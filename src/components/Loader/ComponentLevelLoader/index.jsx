"use client";

import { SyncLoader } from "react-spinners";

export default function ComponentLevelLoader({ text, color, loading, size }) {
  return (
    <span className="flex gap-1 items-center">
      {text}
      <SyncLoader 
        color={color}
        loading={loading}
        size={size || 10}
        data-testid="loader"
      />
    </span>
  );
}
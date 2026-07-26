"use client";

import React from "react";
import dynamic from "next/dynamic";

const DashboardContent = dynamic(() => import("./DashboardContent"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-muted)",
      }}
    >
      Loading dashboard…
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardContent />;
}
"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:3000/api/vercel/deployments").then(
      (res) => console.log,
    );
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <a href="https://vercel.com/integrations/vercel-bisect/new">
          Vercel Log in
        </a>
      </div>
    </main>
  );
}

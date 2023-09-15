"use client";

import { Deployment } from "@/lib/vercel";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Range() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/vercel/deployments").then(
      async (response) => {
        const data = (await response.json()) as Deployment[];
        setDeployments(data);
      },
    );
  }, []);

  return (
    <>
      <nav className="p-4">
        <Link href={"/"}>{"<-"} Go Back</Link>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {deployments && (
          <ol>
            {deployments.map((deployment, index) => (
              <li
                className="flex mb-2 justify-between border-white border-2 p-2 rounded-md flex-col"
                key={index}
              >
                <a
                  className=" underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://${deployment.url}`}
                >
                  {deployment.url}
                </a>

                <div>
                  {new Date(deployment.createdAt).toDateString()}{" "}
                  {new Date(deployment.createdAt).toTimeString()}
                </div>
                <div>{deployment.meta.githubCommitRef}</div>
                <div>{deployment.meta.githubCommitSha}</div>
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  );
}

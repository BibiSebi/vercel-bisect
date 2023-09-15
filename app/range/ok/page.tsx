"use client";

import { Deployment } from "@/lib/vercel";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function Range() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [okDeployment, setOkDeployment] = useState<string>();

  useEffect(() => {
    fetch("http://localhost:3000/api/vercel/deployments").then(
      async (response) => {
        const data = (await response.json()) as Deployment[];
        setDeployments(data);
      },
    );
  }, []);

  const onOptionChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setOkDeployment(e.target.value);
  };

  return (
    <>
      <nav className="p-4">
        <Link href={"/"}>{"<-"} Go Back</Link>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl mb-4">Select last working Deployment</h1>
        {deployments && (
          <ol>
            {deployments.map((deployment, index) => {
              const ready = deployment.readyState === "READY";

              return (
                <li
                  className="flex mb-2 justify-between border-white border-2 p-2 rounded-md flex-col"
                  key={index}
                  onClick={() =>
                    onOptionChange({
                      target: { value: `${deployment.createdAt}` },
                    } as any)
                  }
                >
                  {ready && (
                    <a
                      className=" underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${deployment.url}`}
                    >
                      {deployment.url}
                    </a>
                  )}

                  <div>
                    {new Date(deployment.createdAt).toDateString()}{" "}
                    {new Date(deployment.createdAt).toTimeString()}
                  </div>
                  <div>{deployment.meta.githubCommitRef}</div>
                  <div>{deployment.meta.githubCommitSha}</div>
                  <div>
                    <input
                      type="radio"
                      id={`${deployment.createdAt}`}
                      value={deployment.createdAt}
                      checked={okDeployment === `${deployment.createdAt}`}
                      onChange={onOptionChange}
                      name="isOkRadio"
                    />
                    <label htmlFor={`${deployment.createdAt}`}>Ok</label>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {okDeployment && (
          <Link href={`/range/ok/${okDeployment}/bad`}>
            <button className="bg-white p-2 rounded-md text-black">
              Go to select broken deployment
            </button>
          </Link>
        )}
      </main>
    </>
  );
}

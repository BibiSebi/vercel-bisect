"use client";

import { Deployment } from "@/lib/vercel";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: test if user selects first bad commit
export default function Bisect({ params }: { params: { project: string } }) {
  const searchParams = useSearchParams();

  const qParams = { ok: searchParams.get("ok"), bad: searchParams.get("bad") };

  if (!qParams.ok || !qParams.bad) {
    redirect("/range/ok");
  }
  const [deployments, setDeployments] = useState<any[] | undefined>(undefined);
  const [currentDeployment, setCurrentDeployment] = useState<any | undefined>(
    undefined,
  );
  const [result, setResult] = useState<Deployment | undefined>(undefined);

  useEffect(() => {
    fetch(
      `/api/vercel/projects/${params.project}/deployments?until=${qParams.bad}&since=${qParams.ok}`,
    )
      .then((res) => res.json())
      .then((deployments) => {
        setDeployments(deployments);
        bisect(deployments);
      })
      .catch((e) => console.log("Error", e));
  }, []);

  const bisect = (deployments: any[]) => {
    const binarySearchIndex = getBinarySearchIndex(deployments.length);
    setCurrentDeployment(deployments[binarySearchIndex]);
  };

  const getBinarySearchIndex = (length: number) => Math.floor(length / 2);

  const markDeployment = (type: string) => {
    if (!deployments) {
      return;
    }

    if (deployments.length === 1) {
      console.log("done", deployments[0]);
      setResult(deployments[0]);
      return;
    }

    const binarySearchIndex = getBinarySearchIndex(deployments.length);

    if (type === "good") {
      const restDeployments = deployments.slice(0, binarySearchIndex);
      setDeployments(restDeployments);
      bisect(restDeployments);
      return;
    }

    if (type === "bad") {
      const restDeployments = deployments.slice(
        binarySearchIndex,
        deployments.length + 1,
      );

      setDeployments(restDeployments);
      bisect(restDeployments);
      return;
    }
  };

  return (
    <main className="flex w-screen flex-col h-screen">
      <nav className="p-4">
        <Link href="/">{"<-"} Go Back Home</Link>
      </nav>
      {currentDeployment && (
        <div className={"flex flex-1 flex-col"}>
          {currentDeployment && (
            <h1 className=" text-3xl p-4 text-center">
              Current {currentDeployment.meta.githubCommitMessage}
            </h1>
          )}
          <iframe
            className="w-full h-full flex flex-1"
            referrerPolicy="no-referrer"
            src={`https://${currentDeployment.url}/`}
          />
          <div className="flex justify-center">
            <button
              onClick={() => markDeployment("good")}
              className="border border-1 border-pink-500 p-2"
            >
              Good
            </button>
            <button
              onClick={() => markDeployment("bad")}
              className="border border-1 border-pink-500 p-2"
            >
              Bad
            </button>
          </div>

          {result && (
            <div className="flex-col items-center justify-between p-24">
              This is the first broken deployment:
              <div className="mb-32 flex border-2 border-white p-4 rounded-md justify-around lg:text-left flex-wrap">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="className={`m-0 max-w-[30ch] text-sm opacity-50`}"
                  href={`https://${result.url}`}
                >
                  <span className={`mb-3 text-2xl font-semibold`}>
                    {result.url}
                  </span>
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="m-0 underline max-w-[30ch] text-sm opacity-50"
                  href={`https://github.com/${result.meta.githubCommitOrg}/${result.meta.githubCommitRepo}/commit/${result.meta.githubCommitSha}`}
                >
                  {result.meta.githubCommitSha}
                </a>
                <span>
                  {new Date(result.createdAt).toDateString()}
                  {new Date(result.createdAt).toTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

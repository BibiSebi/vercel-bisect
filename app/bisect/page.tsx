"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

//TODO: test if user selects first bad commit
export default function Bisect() {
  const searchParams = useSearchParams();

  const params = { ok: searchParams.get("ok"), bad: searchParams.get("bad") };

  if (!params.ok || !params.bad) {
    redirect("/range/ok");
  }
  const [deployments, setDeployments] = useState<any[] | undefined>(undefined);
  const [currentDeployment, setCurrentDeployment] = useState<any | undefined>(
    undefined,
  );
  const [result, setResult] = useState<any | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/vercel/deployments?until=${params.bad}&since=${params.ok}`)
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
    <main className="flex w-screen h-screen">
      {currentDeployment && (
        <div className={"flex flex-1 flex-col"}>
          {currentDeployment && (
            <span>Current {currentDeployment.meta.githubCommitMessage}</span>
          )}
          <iframe
            className="w-full h-full flex flex-1"
            referrerPolicy="no-referrer"
            src={`https://${currentDeployment.url}/`}
          />
          <div>
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
            <div>
              Result
              <a target="_blank" href={`https://${result.url}`}>
                {result.url}
              </a>
              {result.meta.githubCommitSha}
              <a
                href={`https://github.com/${result.meta.githubCommitOrg}/${result.meta.githubCommitRepo}/commit/${result.meta.githubCommitSha}`}
              >
                {result.meta.githubCommitSha}
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

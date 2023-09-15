"use client";

import { useEffect, useState } from "react";

//TODO: test if user selects first bad commit
export default function Bisect() {
  const [deployments, setDeployments] = useState<any[] | undefined>(undefined);
  const [currentDeployment, setCurrentDeployment] = useState<any | undefined>(
    undefined,
  );

  useEffect(() => {
    fetch(
      `http://localhost:3000/api/vercel/deployments?until=1694776270198&since=1694771998995`,
    )
      .then((res) => res.json())
      .then((deployments) => {
        setDeployments(deployments);
        bisect(deployments);
      })
      .catch((e) => console.log("Error", e));
  }, []);

  const bisect = (deployments: any[]) => {
    console.log(deployments);
    const binarySearchIndex = Math.floor(deployments.length / 2);
    console.log(binarySearchIndex);

    setCurrentDeployment(deployments[binarySearchIndex]);
  };

  const clickGood = () => {
    if (!deployments) {
      return;
    }
    if (deployments.length === 1) {
      console.log("done", deployments[0]);
      return;
    }
    const binarySearchIndex = Math.floor(deployments.length / 2);

    const restDeployments = deployments.slice(
      binarySearchIndex,
      deployments.length + 1,
    );
    console.log("good rest", restDeployments);
    setDeployments(restDeployments);

    bisect(restDeployments);
  };

  const clickBad = () => {
    if (!deployments) {
      return;
    }
    if (deployments.length === 1) {
      console.log("done", deployments[0]);
      return;
    }

    const binarySearchIndex = Math.floor(deployments.length / 2);

    const restDeployments = deployments.slice(0, binarySearchIndex);

    console.log("bad rest", restDeployments);
    setDeployments(restDeployments);

    bisect(restDeployments);
  };
  return (
    <main className="flex w-screen h-screen">
      {currentDeployment && (
        <div className={"flex flex-1 flex-col"}>
          <iframe
            className="w-full h-full flex flex-1"
            referrerPolicy="no-referrer"
            src={`https://${currentDeployment.url}/`}
          />
          <div>
            <button
              onClick={() => clickBad()}
              className="border border-1 border-pink-500 p-2"
            >
              Good
            </button>
            <button
              onClick={() => clickGood()}
              className="border border-1 border-pink-500 p-2"
            >
              Bad
            </button>

            {currentDeployment && (
              <span>Current {currentDeployment.meta.githubCommitMessage}</span>
            )}
            <div className="flex flex-col">
              {deployments &&
                deployments.map((deployment) => (
                  <span key={deployment.id}>
                    {deployment.meta.githubCommitMessage}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

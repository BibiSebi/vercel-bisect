"use client";
import { Deployment } from "@/lib/vercel";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function RangeBad({
  params,
}: {
  params: { deployment: string };
}) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [brokenDeployment, setBrokenDeployment] = useState<string>();

  useEffect(() => {
    console.log({ params });
    fetch(`/api/vercel/deployments?since=${params.deployment}`).then(
      async (response) => {
        const data = (await response.json()) as Deployment[];
        setDeployments(data);
      },
    );
  }, []);

  const onOptionChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setBrokenDeployment(e.target.value);
  };

  return (
    <>
      <nav className="p-4">
        <Link href={"/range/ok"}>{"<-"} Go Back</Link>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl mb-4">Select first broken Deployment</h1>
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
                  <div>{deployment.meta.githubCommitMessage}</div>
                  <div>
                    <input
                      type="radio"
                      id={`${deployment.createdAt}`}
                      value={deployment.createdAt}
                      checked={brokenDeployment === `${deployment.createdAt}`}
                      onChange={onOptionChange}
                      name="isOkRadio"
                    />
                    <label htmlFor={`${deployment.createdAt}`}>Broken</label>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {brokenDeployment && (
          <Link
            href={`/bisect?ok=${params.deployment}&bad=${brokenDeployment}`}
          >
            <button className="bg-white p-2 rounded-md text-black">
              Go to bisect view
            </button>
          </Link>
        )}
      </main>
    </>
  );
}

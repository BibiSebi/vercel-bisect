"use client";

import { Project } from "@/lib/vercel";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/vercel/projects").then(async (response) => {
      const data = (await response.json()) as Project[];
      setProjects(data);
    });
  }, []);

  return (
    <>
      <nav className="p-4">
        <Link href={"/"}>{"<-"} Go Back</Link>
      </nav>
      <main className="flex min-h-screen flex-col items-center p-24">
        <h1 className="text-4xl mb-4">Select Project to bisect</h1>
        {projects && (
          <ol className="mb-32 grid text-center lg:mb-0 lg:text-left">
            {projects.map((project, index) => {
              return (
                <li
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  key={index}
                >
                  <Link
                    className={`mb-3 text-2xl font-semibold`}
                    href={`/projects/${project.id}/range/ok`}
                  >
                    {project.name}{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      -&gt;
                    </span>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                      {project.link.type}.{project.link.org}.
                      {project.link.productionBranch}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        <div className="mt-auto">
          <span>Can{"'"}t see your project?</span>
          <a
            href="https://vercel.com/dashboard/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Go Manage Integration Access
            </p>
          </a>
        </div>
      </main>
    </>
  );
}

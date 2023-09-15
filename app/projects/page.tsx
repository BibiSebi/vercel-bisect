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
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl mb-4">Select Project to bisect</h1>
        {projects && (
          <ol>
            {projects.map((project, index) => {
              return (
                <li
                  className="flex mb-2 justify-between border-white border-2 p-2 rounded-md flex-col"
                  key={index}
                >
                  <Link href={`/projects/${project.id}/range/ok`}>
                    <b>{project.name}</b>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </>
  );
}

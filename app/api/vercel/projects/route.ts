import { ProjectResponse } from "@/lib/vercel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

//TODO Pagination on client side(?)
export async function GET(request: Request, response: Response) {
  const res = await getProjects();

  return NextResponse.json(res.projects);
}

const getProjects = (): Promise<ProjectResponse> => {
  const token = cookies().get("vercel");
  return fetch(`https://api.vercel.com/v9/projects?limit=100`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  }).then((res) => res.json());
};

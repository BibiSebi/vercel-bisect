import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

const getProjects = () => {
  const token = cookies().get("vercel");
  return fetch(`https://api.vercel.com/v9/projects`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  }).then((res) => res.json());
};

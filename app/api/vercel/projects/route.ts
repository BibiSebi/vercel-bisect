import { ProjectResponse } from "@/lib/vercel";
import { NextResponse } from "next/server";
import { getSession } from "@/app/api/vercel/utils/jwt";

//TODO Pagination on client side(?)
export async function GET(request: Request, response: Response) {
  const res = await getProjects();

  return NextResponse.json(res.projects);
}

const getProjects = (): Promise<ProjectResponse> => {
  const session: any = getSession();
  return fetch(`https://api.vercel.com/v9/projects?limit=100`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  }).then((res) => res.json());
};

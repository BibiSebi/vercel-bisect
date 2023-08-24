import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const goodDeployment = 1692876045984;
const badDeployment = 1692876030384;
const projectId = process.env.PROJECT_ID;

// since: Get Deployments created after this JavaScript timestamp. (bad)
// until: Get Deployments created before this JavaScript timestamp. (good)
export async function GET(request: Request, response: Response) {
  const deployments = await getPaginatedDeployments(
    String(badDeployment),
    String(goodDeployment + 1),
  );
  return NextResponse.json(deployments);
}

// @ts-ignore
export const getPaginatedDeployments = async (since: string, until: string) => {
  const deploymentsRes = await fetchDeployments(since, until);

  if (!deploymentsRes.deployments) {
    return [];
  }

  if (deploymentsRes.pagination.next === null) {
    return deploymentsRes.deployments;
  }

  // @ts-ignore
  const nextDeployments = await getPaginatedDeployments(
    since,
    deploymentsRes.pagination.next,
  );

  return [...deploymentsRes.deployments, ...nextDeployments];
};

//TODO: remove project id
const fetchDeployments = (since: string, until: string) => {
  const token = cookies().get("vercel");
  return fetch(
    `https://api.vercel.com/v6/deployments?target=production&since=${since}&until=${until}&projectId=${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    },
  ).then((res) => res.json());
};

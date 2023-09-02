import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const goodDeployment = 1692876045984;
const badDeployment = 1692876030384;
const projectId = process.env.PROJECT_ID;

// since: Get Deployments created after this JavaScript timestamp. (bad)
// until: Get Deployments created before this JavaScript timestamp. (good)
export async function GET(request: Request, response: Response) {
  //GET deployments between good and bad
  const deployments = await getPaginatedDeployments(
    String(badDeployment),
    String(goodDeployment + 1),
  );
  //GET all deployments of a project
  const allDeployments = await getPaginatedDeployments();
  return NextResponse.json(deployments);
}

type GetPaginatedDeployments = (since?: string, until?: string) => Promise<any>;
const getPaginatedDeployments: GetPaginatedDeployments = async (
  since,
  until,
) => {
  const deploymentsRes = await fetchDeployments(since, until);

  if (!deploymentsRes.deployments) {
    return [];
  }

  const deployments: any[] = deploymentsRes.deployments;

  if (deploymentsRes.pagination.next === null) {
    return deployments;
  }

  // @ts-ignore
  //TODO: set limit to 100
  const nextDeployments = await getPaginatedDeployments(
    since,
    deploymentsRes.pagination.next,
  );

  if (
    nextDeployments &&
    Array.isArray(nextDeployments) &&
    nextDeployments.length > 0
  ) {
    deployments.push(nextDeployments);
  }

  return deployments;
};

type FetchDeployments = (since?: string, until?: string) => Promise<any>;
const fetchDeployments: FetchDeployments = (since, until) => {
  const token = cookies().get("vercel");
  const query = {
    target: "production",
    until,
    since,
    projectId,
  };
  //TODO: build query depending on the paramaters given

  //TODO: error handling
  return fetch(
    `https://api.vercel.com/v6/deployments?target=production&since=${since}&until=${until}&projectId=${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e));
};

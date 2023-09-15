import { DeploymentsResponse } from "@/lib/vercel";
import { NextResponse } from "next/server";
import { getSession } from "@/app/api/vercel/utils/jwt";

// since: Get Deployments created after this JavaScript timestamp. (bad)
// until: Get Deployments created before this JavaScript timestamp. (good)
export async function GET(
  request: Request,
  { params }: { params: { project: string } },
) {
  const { searchParams } = new URL(request.url);
  const until = searchParams.get("until") || undefined;
  const since = searchParams.get("since") || undefined;

  const deployments = await getPaginatedDeployments(
    params.project,
    until,
    since,
  );

  return NextResponse.json(deployments);
}

type GetPaginatedDeployments = (
  project: string,
  until?: string,
  since?: string,
) => Promise<any>;
const getPaginatedDeployments: GetPaginatedDeployments = async (
  project,
  until,
  since,
) => {
  const deploymentsRes = await fetchDeployments(project, until, since);

  if (deploymentsRes.pagination?.next) {
    const nextDeployments = await getPaginatedDeployments(
      deploymentsRes.pagination.next,
      since,
    );

    return [...deploymentsRes.deployments, ...nextDeployments];
  } else {
    return deploymentsRes.deployments;
  }
};

type FetchDeployments = (
  project: string,
  until?: string,
  since?: string,
) => Promise<DeploymentsResponse>;
const fetchDeployments: FetchDeployments = (project, until, since) => {
  const session: any = getSession();
  const url = `https://api.vercel.com/v6/deployments?limit=100&state=READY&projectId=${project}`;

  console.log(
    `${url}${until ? "&until=" + until : ""}${since ? "&since=" + since : ""}`,
  );

  //TODO: error handling
  return fetch(
    `${url}${until ? "&until=" + until : ""}${since ? "&since=" + since : ""}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((e) => console.log(e));
};

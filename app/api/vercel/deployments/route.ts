import { DeploymentsResponse } from "@/lib/vercel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// since: Get Deployments created after this JavaScript timestamp. (bad)
// until: Get Deployments created before this JavaScript timestamp. (good)
export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const until = searchParams.get("until") || undefined;
  const since = searchParams.get("since") || undefined;

  const deployments = await getPaginatedDeployments(until, since);

  return NextResponse.json(deployments);
}

type GetPaginatedDeployments = (until?: string, since?: string) => Promise<any>;
const getPaginatedDeployments: GetPaginatedDeployments = async (
  until,
  since,
) => {
  const deploymentsRes = await fetchDeployments(until, since);

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
  until?: string,
  since?: string,
) => Promise<DeploymentsResponse>;
const fetchDeployments: FetchDeployments = (until, since) => {
  const token = cookies().get("vercel");
  const url = "https://api.vercel.com/v6/deployments?limit=100&state=READY";

  console.log(
    `${url}${until ? "&until=" + until : ""}${since ? "&since=" + since : ""}`,
  );

  //TODO: error handling
  return fetch(
    `${url}${until ? "&until=" + until : ""}${since ? "&since=" + since : ""}`,
    {
      headers: {
        Authorization: `Bearer ${token?.value}`,
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

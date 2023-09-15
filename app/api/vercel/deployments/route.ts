import { DeploymentsResponse } from "@/lib/vercel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next");

  console.log({ next, searchParams });

  const deployments = await getPaginatedDeployments(next || undefined);

  return NextResponse.json(deployments);
}

type GetPaginatedDeployments = (until?: string) => Promise<any>;
const getPaginatedDeployments: GetPaginatedDeployments = async (until) => {
  const deploymentsRes = await fetchDeployments(until);

  console.log(deploymentsRes);

  if (deploymentsRes.pagination?.next) {
    const nextDeployments = await getPaginatedDeployments(
      deploymentsRes.pagination.next,
    );

    return [...deploymentsRes.deployments, ...nextDeployments];
  } else {
    return deploymentsRes.deployments;
  }
};

type FetchDeployments = (until?: string) => Promise<DeploymentsResponse>;
const fetchDeployments: FetchDeployments = (until) => {
  const token = cookies().get("vercel");
  const url = "https://api.vercel.com/v6/deployments?limit=100";

  console.log(`${url}${until ? "&until=" + until : ""}`);

  //TODO: error handling
  return fetch(`${url}${until ? "&until=" + until : ""}`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .catch((e) => console.log(e));
};

import { DeploymentsResponse } from "@/lib/vercel";
import { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest, response: NextApiRequest) {
  const deployments = await getPaginatedDeployments();

  return NextResponse.json(deployments);
}

type GetPaginatedDeployments = (until?: string) => Promise<any>;
const getPaginatedDeployments: GetPaginatedDeployments = async (until) => {
  const deploymentsRes = await fetchDeployments(until);

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

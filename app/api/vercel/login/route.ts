import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request, response: Response) {
  const user = await getUser();
  return NextResponse.json(user);
}

const getUser = () => {
  const token = cookies().get("vercel");
  return fetch(`https://api.vercel.com/v2/user`, {
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  }).then((res) => res.json());
};

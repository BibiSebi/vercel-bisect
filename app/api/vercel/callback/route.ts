import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  try {
    if (code) {
      const token = await getToken(code);

      cookies().set({
        name: "vercel",
        value: token.access_token,
        httpOnly: true,
        path: "/",
      });
    }

    // TODO: save bearer token & redirect to the main
  } catch (e) {
    console.log("error", e);
    return NextResponse.json({});
  }

  return NextResponse.json({});
}

const getToken = (code: string) =>
  fetch(`https://api.vercel.com/v2/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
    body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=http://localhost:3000/api/vercel/callback`,
  }).then((res) => res.json());

//Next steps:
// 1. Save token in cookies for now
// 2. Get all deployments between good and bad (pagination)
// 3. Create logic for binary search (recursive function)

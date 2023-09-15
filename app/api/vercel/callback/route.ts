import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { setSession } from "@/app/api/vercel/utils/jwt";
export async function GET(request: Request, response: Response) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (code) {
      const tokenResponse = await getToken(code);
      setSession(tokenResponse);
    }
  } catch (e) {
    //TODO: redirect to 401
    console.log("error", e);
    return NextResponse.json({});
  }

  redirect("/");
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

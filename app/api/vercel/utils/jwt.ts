import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getSession = () => {
  const cookie = cookies().get("vercel-bisect");
  if (!cookie) {
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return;
  }

  try {
    const decodedToken = jwt.verify(cookie.value, jwtSecret);
    return decodedToken;
  } catch (e) {
    console.log(e);
    return;
  }
};

export const setSession = (token: any) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (jwtSecret) {
    const encryptedSecret = jwt.sign(token, jwtSecret);

    cookies().set({
      name: "vercel-bisect",
      value: encryptedSecret,
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
  }
};

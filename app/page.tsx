import { cookies } from "next/headers";
import Link from "next/link";

export default function Home() {
  const vercelCookie = cookies().get("vercel");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!vercelCookie && (
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
            href="https://vercel.com/integrations/vercel-bisect/new"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Vercel Log in
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Connect your Vercel Account
            </p>
          </a>
        </div>
      )}

      {vercelCookie && (
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          <Link
            href="/projects"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Start Bisecting{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Select a Project and find the first broken deployment via vercel
              bisect
            </p>
          </Link>
        </div>
      )}
    </main>
  );
}

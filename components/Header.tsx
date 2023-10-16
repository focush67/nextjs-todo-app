import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    localStorage.removeItem(session?.user?.email || "");
    signOut();
  };

  return (
    <header className="bg-black text-white flex justify-between items-center p-4 sm:text-md md:text-lg lg:text-lg w-[100%] sticky top-0 z-10">
      <div className="font-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <nav className="flex items-center gap-3">
        <Link href="/">Home</Link>
        <Link href="/list">My List</Link>
        <Link href="/frequent">Frequent</Link>
        <div className="text-gray-600">{session && session?.user?.name}</div>
        {session ? (
          <div className="flex items-center">
            <Image
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
              width={40}
              height={40}
              className="rounded-full mr-2 ml-2"
            />
            <button
              className="bg-transparent hover:bg-red-900 text-white font-normal hover:text-white py-2 px-4 border border-red-500 border-opacity-0 hover:border-transparent rounded mx-3"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="bg-transparent hover:bg-green-700 text-white font-semibold hover:text-white py-2 px-4 border border-green-500 border-opacity-0 hover:border-transparent rounded mx-3"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;

import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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
    <header className="bg-black text-white flex justify-between items-center p-4 pl-2 pr-2 sm:text-[1rem] md:text-md lg:text-lg lg:gap-5 sticky top-0 z-10 w-full">
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
      <nav className="flex items-center gap-3 lg:gap-2 xl:gap-4">
        <Link href="/">Home</Link>
        <Link href="/list">Tasks</Link>
        
        <div className="text-gray-600 whitespace-nowrap">{session && session?.user?.name}</div>
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
              className="bg-transparent hover:bg-red-900 text-white font-normal hover:text-white py-1 px-3 sm:py-2 sm:px-4 border border-red-500 border-opacity-0 hover:border-transparent rounded mx-2"
              onClick={handleSignOut}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            className="bg-transparent hover:bg-green-700 text-white font-semibold hover:text-white py-1 px-3 sm:py-2 sm:px-4 border border-green-500 border-opacity-0 hover:border-transparent rounded mx-1"
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

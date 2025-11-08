import { Video } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";


const Navbar = () => {
  return (
    <header className="mx-auto px-5 b max-w-9xl ">
      <nav className="w-full shadow border-[0px] bg-white px-5 py-3 rounded-full flex justify-between items-center">
        <div className="text-xl font-extrabold">NeuroReel</div>
        
        <div className="flex items-center gap-5">
          <Link href={"/"}>
            <Video className="" />
          </Link>
          <Link href={"/"}>
            <Button className="rounded-full text-black text-md p-4 border-2 border-lime-500 hover:bg-lime-400 bg-lime-200">
                Start Creating
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

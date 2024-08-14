import { useState } from "react";
import { Link } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { HiMiniBars3 } from "react-icons/hi2";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const { open } = useWeb3Modal();

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="flex bg-gray-100  sticky top-0 z-50 w-full shadow-lg border-b border-gray-400">
      <div className="flex w-full justify-between items-center px-4 md:px-10 lg:px-20 max-w-screen-xl py-4">
        <div>
          <Link to="/">
            <p className="text-base md:text-2xl font-bold text-gray-800 text-opacity-70">
              Finance Management System
            </p>
          </Link>
        </div>
        <nav className="hidden md:flex justify-between items-center gap-5">
          <Link to="/addfinance">
            <button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-700 text-white text-sm font-medium px-3 py-3 rounded-md flex gap-2">
              <svg
                className="w-4 h-4 fill-current shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span>Add Your Finance</span>
            </button>
          </Link>

          <button
            className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-700 text-white text-sm font-medium px-3 py-3 rounded-md flex gap-2"
            onClick={() =>
              address
                ? chain?.id == chains[0]?.id
                  ? open()
                  : switchNetwork?.(chains[0]?.id)
                : open()
            }
          >
            <span>
              {" "}
              {address ? (
                chain?.id == chains[0]?.id || chain?.id == chains[1]?.id ? (
                  address ? (
                    <>
                      {`${address.substring(0, 6)}...${address.substring(
                        address.length - 4
                      )}`}
                    </>
                  ) : (
                    <>
                      <span className="mx-1">Connect Wallet</span>
                    </>
                  )
                ) : (
                  "Switch NetWork"
                )
              ) : (
                <>
                  <span className="mx-1">Connect Wallet</span>
                </>
              )}
            </span>
          </button>
        </nav>
        <div className="md:hidden flex justify-center items-center gap-2 px-4">
          <HiMiniBars3
            onClick={toggleMenu}
            className="text-2xl font-bold text-black cursor-pointer"
          />
        </div>
      </div>
      {isMenuOpen && (
        <div className="fixed top-0 left-0 right-0 bg-gray-50 w-60 z-50 h-screen flex flex-col justify-start items-center lg:hidden shadow-lg">
          <div className="flex justify-between py-3 px-4 w-full">
            <div>
              <Link to="/" onClick={closeMenu}>
                {/* <img src={logo} alt="Logo" className="max-w-28" /> */}
              </Link>
            </div>
            <button
              className="text-xl font-extrabold bg-green-500 hover:bg-green-600 w-8 h-8 flex justify-center items-center text-white rounded-md transition duration-300"
              onClick={closeMenu}
            >
              <HiX />
            </button>
          </div>
          <nav className="flex flex-col justify-center items-center gap-4 pt-1">
            <Link to="/addfinance" onClick={closeMenu}>
              <button className="bg-green-500 flex hover:bg-green-600 text-white text-sm font-medium text-center px-3 py-2 rounded-md items-center gap-2 transition duration-300">
                <svg
                  className="w-4 h-4 fill-current opacity-75 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span>Add Your Finance</span>
              </button>
            </Link>
            <Link to="/addfinance" onClick={closeMenu}>
              <button className="bg-green-500 flex hover:bg-green-600 text-white text-sm font-medium text-center px-3 py-2 rounded-md items-center gap-2 transition duration-300">
                <svg
                  className="w-4 h-4 fill-current opacity-75 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span>Add </span>
              </button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

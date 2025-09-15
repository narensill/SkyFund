import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomButton } from "./";
import { logo, search, menu, thirdweb } from "../assets";
import { navlinks } from "../constants";
import { useStateContext } from "../context/useStateContext.js";

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address } = useStateContext();

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* Search Bar */}
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#FFFFF2] rounded-[20px] border border-[#3a3a43] shadow-secondary">
        <input
          type="text"
          placeholder="Search for campaigns"
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
        />
        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <img
            src={search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className="sm:flex hidden flex-row justify-end gap-4 ">
        <CustomButton
          btnType="button"
          title={address ? "Create a campaign" : "Connect Wallet"}
          styles={address ? "bg-[#20B024] shadow-secondary" : "bg-[#8c6dfd] shadow-secondary"}
          handleClick={() => {
            if (address) navigate("create-campaign");
            else connect();
          }}
        />
        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-[20px] bg-[#FFFFF7] flex justify-center items-center cursor-pointer border border-[#3a3a43] shadow-secondary">
            <img
              src={thirdweb}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <div className="sm:hidden flex justify-between items-center relative gap-x-4">
        <div className="w-[40px] h-[40px] rounded-[20px] bg-[#FFFFE2] flex justify-center items-center cursor-pointer shadow-secondary">
          <img
            src={thirdweb}
            alt="user"
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
        <img
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer z-20"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        {/* Drawer */}
        <div
          className={`fixed top-[60px] left-0 right-0 bg-[#FFFFE2] z-40 shadow-secondary py-4 transform transition-transform duration-500 overflow-auto max-h-[calc(100vh-60px)] ${
            toggleDrawer
              ? "translate-y-0"
              : "translate-y-[100vh] pointer-events-none"
          }`}
        >
          <ul className="mb-4 ">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 cursor-pointer relative group ${
                  isActive === link.name ? "bg-[#FFFFEE]" : "hover:bg-[#EBEBCE]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p className="ml-[20px] font-epilogue font-semibold text-[14px] text-[#3a3a43]">
                  {link.name}
                </p>

                {/* underline effect */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#3a3a43] transition-all duration-300 
      ${isActive === link.name ? "w-3/4" : "w-1/2 group-hover:w-3/4"}`}
                ></span>
              </li>
            ))}
          </ul>
          <div className="flex mx-4 ">
            <CustomButton
              btnType="button"
              title={address ? "Create a campaign" : "Connect Wallet"}
              styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
              handleClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

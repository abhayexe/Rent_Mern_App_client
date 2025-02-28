import { FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ setActiveSection, onSectionHover, onSectionLeave }) => {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleItemClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="w-full lg:w-full flex flex-col justify-between">
      {/* Navigation Links */}
      <div className="flex flex-col">
        <div
          onClick={() => handleItemClick("profile")}
          onMouseEnter={() => onSectionHover("profile")}
          onMouseLeave={onSectionLeave}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Profile
        </div>
        <div
          onClick={() => handleItemClick("messages")}
          onMouseEnter={() => onSectionHover("messages")}
          onMouseLeave={onSectionLeave}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Messages
        </div>
        <div
          onClick={() => handleItemClick("readLater")}
          onMouseEnter={() => onSectionHover("readLater")}
          onMouseLeave={onSectionLeave}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Wishlist
        </div>
        <div
          onClick={() => handleItemClick("myRentals")}
          onMouseEnter={() => onSectionHover("myRentals")}
          onMouseLeave={onSectionLeave}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          My Rentals
        </div>
        <div
          onClick={() => handleItemClick("downloads")}
          onMouseEnter={() => onSectionHover("downloads")}
          onMouseLeave={onSectionLeave}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Subscription
        </div>
        {/* Settings Section */}
        <div
          onClick={() => handleItemClick("settings")}
          onMouseEnter={() => onSectionHover("settings")}
          onMouseLeave={onSectionLeave}
          className="w-full py-4 px-6 text-white font-bold text-lg cursor-pointer hover:bg-yellow-500 hover:text-black transition-all duration-300"
        >
          Settings
        </div>
      </div>

      {/* Logout Section */}
      <div
        onClick={handleLogout}
        className="w-full py-4 px-6 bg-red-600 text-white font-bold text-lg cursor-pointer hover:bg-red-700 hover:text-zinc-300 transition-all duration-300 mt-2 flex items-center"
      >
        Log Out <FaSignOutAlt className="ml-2" />
      </div>
    </div>
  );
};

export default Sidebar;

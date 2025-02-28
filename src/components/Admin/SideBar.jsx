import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightFromBracket } from "react-icons/fa";
import axios from "axios";

const Sidebar = () => {
  const [userData, setUserData] = useState(null); // State to store user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Retrieve token from session storage
        const userId = sessionStorage.getItem("id"); // Retrieve user ID from session storage

        if (!token || !userId) {
          throw new Error("Authorization headers are missing.");
        }

        const response = await axios.get("http://localhost:3000/api/user/data", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token as Authorization header
            id: userId, // Pass user ID as custom header
          },
        });

        if (response.data.success) {
          setUserData(response.data.userData); // Set user data to state
        } else {
          console.error("Failed to fetch user data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-zinc-800 p-4 rounded flex flex-col items-center justify-between h-auto lg:h-[100%]">
      <div className="flex items-center flex-col justify-center">
        <img
          src={userData?.avatar || "https://via.placeholder.com/150"}
          className="h-[12vh] rounded-full"
          alt="User"
        />
        <p className="mt-3 text-xl text-zinc-100 font-semibold">
          {userData?.name || "Guest"}
        </p>
        <p className="text-zinc-100 font-semibold text-sm">
          {userData?.email || "No email provided"}
        </p>
        <div className="w-full mt-4 h-[1px] bg-zinc-500 hidden lg:block"></div>
      </div>

      <div className="w-full flex lg:flex-col items-center justify-between mt-4">
        <Link
          to="/profile"
          className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transition-all duration-300 py-2"
        >
          All Resources
        </Link>
        <Link
          to="/admin-dashboard/add-resource"
          className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transition-all duration-300 py-2"
        >
          Add Resources
        </Link>
        <Link
          to="/profile/update-resources"
          className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transition-all duration-300 py-2"
        >
          Update Resources
        </Link>
        <Link
          to="/profile/delete-resources"
          className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transition-all duration-300 py-2"
        >
          Delete Resources
        </Link>
        <Link
          to="/profile/view-all-users"
          className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transition-all duration-300 py-2"
        >
          View All Users
        </Link>
        <Link
          to="/profile/mail-all-users"
          className="text-zinc-100 font-semibold w-full text-center hover:bg-zinc-900 rounded transition-all duration-300 py-2"
        >
          Mail Users
        </Link>
      </div>

      <button
        className="bg-zinc-900 w-3/6 lg:w-full mt-4 lg:mt-0 text-white font-semibold flex items-center justify-center py-2 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
        onClick={handleLogout}
      >
        Log Out <FaArrowRightFromBracket className="ml-4" />
      </button>
    </div>
  );
};

export default Sidebar;

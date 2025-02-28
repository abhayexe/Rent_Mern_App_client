import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../Loder"; 
import { FaBookReader, FaFileDownload, FaReadme } from "react-icons/fa";

const ViewResources = () => {
  const { id } = useParams(); // Extract resource ID from the URL
  const location = useLocation(); // Access location state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [userData, setUserData] = useState(null); // State to hold user data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:3000/api/user/data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data.userData); // Store user data
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    // Fetch resource data
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/resource/get-resource-by-id/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching resource:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchData();
  }, [id]);

  const headers = userData
    ? {
        id: userData.id, 
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
        resourceId: id, 
      }
    : {};

  const handleReadLater = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/readlater/add-resource-to-read-later",
        {},
        { headers }
      );
      setNotification(response.data.message || "Added to Read Later!");
    } catch (error) {
      setNotification("Failed to add to Read Later.");
    }
  };

  const handleRemoveFromReadLater = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/api/readlater/remove-resource-from-read-later",
        {},
        { headers }
      );
      setNotification(response.data.message || "Removed from Read Later!");
    } catch (error) {
      setNotification("Failed to remove from Read Later.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-red-500">Failed to load resource. Please try again later.</p>
      </div>
    );
  }

  return (
    data && (
      <div className="h-full w-full bg-zinc-900 flex flex-col items-start px-8 py-8">
        {notification && (
          <div className="w-full max-w-lg mx-auto p-4 bg-red-500 text-white text-center font-bold rounded-lg mb-6">
            {notification}
          </div>
        )}

        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-zinc-800 rounded-lg p-6">
          <div className="lg:w-1/2">
            <div className="h-[88vh] bg-zinc-900 rounded flex justify-center items-center p-4">
              <img
                src={data.image}
                alt={data.title}
                className="h-full max-h-[88vh] object-contain rounded"
              />
            </div>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0 lg:ml-8">
            <h1 className="text-4xl text-white font-bold">{data.title}</h1>
            <p className="text-lg text-zinc-400 mt-2">By {data.author}</p>
            <p className="text-lg text-zinc-500 mt-4">{data.desc}</p>
            <p className="text-lg text-zinc-400 font-medium mt-4">
              Category: {data.category}
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              {isLoggedIn ? (
                <>
                  {location.state?.fromReadLater ? (
                    <>
                      <button
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 text-lg"
                        onClick={handleRemoveFromReadLater}
                      >
                        Remove from Read Later
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 text-lg"
                        onClick={handleReadLater}
                      >
                        <FaBookReader size={20} />
                        Read Later
                      </button>
                    </>
                  )}

                  <button
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 text-lg"
                  >
                    <FaFileDownload size={20} />
                    Download
                  </button>

                  <button
                    onClick={() => {
                      if (data?.url) {
                        window.location.href = data.url; // Redirect to the resource URL directly
                      } else {
                        setNotification("No valid link found for this resource.");
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 text-lg"
                  >
                    <FaReadme size={20} />
                    Read Now
                  </button>
                </>
              ) : (
                <p className="text-lg text-zinc-400 font-medium">
                  Please log in to access the actions.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ViewResources;

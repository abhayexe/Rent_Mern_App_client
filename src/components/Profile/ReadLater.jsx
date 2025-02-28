import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const ReadLater = () => {
  const [userData, setUserData] = useState(null); // State to store user info
  const [readLaterResources, setReadLaterResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate(); // Use navigate to redirect to ViewResource

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError(true);
          return;
        }
        const response = await axios.get("http://localhost:3000/api/user/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data.userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only once on component mount

  useEffect(() => {
    // Fetch Read Later resources only if userData is available
    const fetchReadLaterResources = async () => {
      if (!userData) return; // Don't fetch if userData is not yet available

      const headers = {
        id: userData.id, // Use userData.id here
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      };

      try {
        const response = await axios.get(
          "http://localhost:3000/api/readlater/fetch-all-resource-from-read-later",
          { headers }
        );
        setReadLaterResources(response.data.data); 
      } catch (err) {
        console.error("Error fetching Read Later resources:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReadLaterResources();
  }, [userData]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load data. Please try again later.</div>;
  }

  return (
    <div>
      <h4 className="text-3xl text-yellow-200 mb-8">Read Later</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readLaterResources.length > 0 ? (
          readLaterResources.map((resource) => (
            <div
              key={resource._id}
              className="bg-zinc-800 p-4 rounded-lg shadow-lg flex flex-col cursor-pointer"
              onClick={() => {
                // Navigate to the ViewResource page, passing the resource ID
                navigate(`/viewResource/${resource._id}`);
              }}
            >
              <img
                src={resource.image || "https://via.placeholder.com/150"}
                alt={resource.title}
                className="w-full h-40 object-cover rounded-md"
              />
              <h5 className="text-xl text-white font-semibold mt-4">{resource.title}</h5>
              <p className="text-sm text-zinc-400 mt-2">
                {resource.desc|| "No description available"}
              </p>
            </div>
          ))
        ) : (
          <p>No resources in your Read Later list.</p>
        )}
      </div>
    </div>
  );
};

export default ReadLater;
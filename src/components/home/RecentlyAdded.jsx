import { useState, useEffect } from "react";
import ResourceCard from "../ResourceCard/ResourceCard";
import axios from "axios";
import Loader from "../Loder";

const RecentlyAdded = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/resource/get-recently-added-resource"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching recently added resources:", error);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-200">Recently Added Resources</h4>

      {/* Loader */}
      {loading ? (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      ) : (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Display Data */}
          {data.length > 0 ? (
            data.map((item, i) => <ResourceCard key={i} data={item} />)
          ) : (
            <p className="text-yellow-400">No resources found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;

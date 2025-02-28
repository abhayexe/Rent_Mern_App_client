import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewAllResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetch resources from the API
        const response = await axios.get("http://localhost:3000/api/resources");
        setResources(response.data); // Assuming response.data contains an array of resources
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return <div>Loading resources...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-yellow-400 mb-6">All Resources</h2>
      <table className="w-full bg-zinc-800 border border-gray-700 rounded text-left">
        <thead>
          <tr className="text-yellow-400">
            <th className="py-2 px-4 border-b border-gray-700">ID</th>
            <th className="py-2 px-4 border-b border-gray-700">Title</th>
            <th className="py-2 px-4 border-b border-gray-700">Category</th>
            <th className="py-2 px-4 border-b border-gray-700">Author</th>
            <th className="py-2 px-4 border-b border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td className="py-2 px-4 border-b border-gray-700">{resource.id}</td>
              <td className="py-2 px-4 border-b border-gray-700">{resource.title}</td>
              <td className="py-2 px-4 border-b border-gray-700">{resource.category}</td>
              <td className="py-2 px-4 border-b border-gray-700">{resource.author}</td>
              <td className="py-2 px-4 border-b border-gray-700">
                <button className="text-blue-500 hover:underline">View</button>
                <button className="text-yellow-500 hover:underline ml-2">Edit</button>
                <button className="text-red-500 hover:underline ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllResources;

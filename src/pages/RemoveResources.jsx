import { useState, useEffect } from "react";
import axios from "axios";

const RemoveResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch all resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/resource/get-all-resource",
          { headers }
        );

        // Check if the response contains an array of resources
        if (response.data && Array.isArray(response.data.data)) {
          setResources(response.data.data); // Set resources from response.data.data
        } else {
          setResources([]); // Set to empty array if not an array
          console.error("API response does not contain a valid array");
        }
        setLoading(false);
      } catch (error) {
        alert("An error occurred while fetching resources.");
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Delete a resource
  const handleDelete = async () => {
    if (!selectedResource || !selectedResource._id) {
      console.error("No resource selected or resource ID is missing");
      return;
    }

    try {
      // Assuming that the API expects a POST request to delete the resource
      const response = await axios.post(
        "http://localhost:3000/api/resource/delete-resource", // URL for POST
        { id: selectedResource._id }, // Pass the resource ID in the request body
        { headers } // Include the necessary headers
      );

      console.log("Delete response:", response); // Log the response

      if (response.status === 200) {
        alert("Resource deleted successfully!");
        setResources(resources.filter((res) => res._id !== selectedResource._id)); // Remove the deleted resource from the list
        setSelectedResource(null); // Close the dialog
      } else {
        alert("Failed to delete the resource.");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("An error occurred while deleting the resource.");
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-yellow-100 mb-8">Remove Resources</h1>

      {/* List of Resources */}
      {Array.isArray(resources) && resources.length > 0 ? (
        <ul className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
          {resources.map((resource) => (
            <li
              key={resource._id}
              className="text-gray-100 font-medium mb-2 cursor-pointer hover:text-red-400"
              onClick={() => setSelectedResource(resource)} // Select the resource
            >
              {resource.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No resources available.</p>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedResource && selectedResource._id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-yellow-100 mb-4">
              Are you sure you want to delete?
            </h2>
            <p className="text-gray-300 mb-6">
              Resource: <strong>{selectedResource.title}</strong>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all"
                onClick={() => setSelectedResource(null)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemoveResources;

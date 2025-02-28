import { useState, useEffect } from "react";
import axios from "axios";

const UpdateResources = () => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [data, setData] = useState(null); // Holds resource details for update
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const categories = [
    "Book",
    "Document",
    "Court Hearing",
    "Case Study",
    "Newspaper",
  ];

  // Fetch all resources for the admin to select from
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/resource/get-all-resource",
          { headers }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setResources(response.data.data); // Set resources from response
        } else {
          console.error("Failed to fetch resources.");
        }
      } catch (error) {
        alert("An error occurred while fetching resources.");
      }
    };

    fetchResources();
  }, []);

  // Handle clicking on a resource
  const handleSelectResource = (resource) => {
    setSelectedResource(resource); // Set the clicked resource as the selected one
    setData(resource); // Set the data to the selected resource data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!data.url || !data.title || !data.author || !data.desc || !data.category) {
      alert("All fields are required.");
      return;
    }

    // Log the headers to see the resource ID in the header
    console.log("Headers:", headers);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/resource/update-resource/${selectedResource._id}`,
        { ...data },
        { headers }
      );

      if (response.status === 200) {
        alert("Resource updated successfully!");
        setSelectedResource(null); // Reset selected resource
        setData(null); // Reset form
      }
    } catch (error) {
      alert("An error occurred while updating the resource.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-yellow-100 mb-8">Update Resources</h1>

      {/* Resource List */}
      {!selectedResource && (
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-gray-300 mb-4">Select a Resource to Update</h2>
          <ul>
            {resources.map((resource) => (
              <li
                key={resource._id}
                className="text-gray-100 font-medium mb-2 cursor-pointer hover:text-yellow-400"
                onClick={() => handleSelectResource(resource)} // Select the resource
              >
                {resource.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Update Resource Form */}
      {selectedResource && (
        <form
          className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg mt-8"
          onSubmit={handleUpdate}
        >
          {/* Display Resource ID at the top (non-editable) */}
          <div className="mb-4">
            <label className="block text-gray-300 font-medium">Resource ID</label>
            <input
              type="text"
              value={selectedResource._id} // Use selected resource ID
              disabled
              className="w-full p-2 bg-gray-700 text-gray-100 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="url" className="block text-gray-300 font-medium">
              Image URL
            </label>
            <input
              type="text"
              name="url"
              value={data?.url || ""}
              onChange={handleChange}
              className="w-full mt-2 p-2 bg-gray-700 text-gray-100 rounded"
              placeholder="Enter image URL"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={data?.title || ""}
              onChange={handleChange}
              className="w-full mt-2 p-2 bg-gray-700 text-gray-100 rounded"
              placeholder="Enter title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-300 font-medium">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={data?.author || ""}
              onChange={handleChange}
              className="w-full mt-2 p-2 bg-gray-700 text-gray-100 rounded"
              placeholder="Enter author name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="desc" className="block text-gray-300 font-medium">
              Description
            </label>
            <textarea
              name="desc"
              value={data?.desc || ""}
              onChange={handleChange}
              className="w-full mt-2 p-2 bg-gray-700 text-gray-100 rounded"
              placeholder="Enter a description"
              rows="4"
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-300 font-medium">
              Category
            </label>
            <select
              name="category"
              value={data?.category || ""}
              onChange={handleChange}
              className="w-full mt-2 p-2 bg-gray-700 text-gray-100 rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-all duration-300"
          >
            Update Resource
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateResources;

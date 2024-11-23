import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTopic = () => {
  const { id } = useParams(); // Get the id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    description: "",
  });

  // Fetch topic data when the component is mounted
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/topics/${id}`);
        setFormData({
          name: response.data.name,
          level: response.data.level,
          description: response.data.description,
        });
      } catch (error) {
        alert("Error fetching topic data: " + error.message);
      }
    };

    fetchTopicData();
  }, [id]); // Dependency array ensures the data is fetched when the ID changes

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to update topic
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, level, description } = formData;

    // Validate if all fields are filled
    if (!name || !level || !description) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      // Send PUT request to update the topic in the database
      const response = await axios.put(`http://localhost:5000/api/topics/${id}`, {
        name,
        level,
        description,
      });

      // Show success message
      alert(response.data.message);

      // Navigate back to the topic list page after successful update
      navigate("/topic");
    } catch (error) {
      // Handle error if the update fails
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="pl-10 pt-4 pr-10">
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2">
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter topic name..."
            />

            <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2">
              Level
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              placeholder="Enter topic level..."
            />

            <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2">
              Description
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter topic description..."
            />
          </div>
          <button
            type="submit"
            className="mt-6 ml-6 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Update
          </button>
        </div>
      </form>
      <hr />
    </div>
  );
};

export default EditTopic;

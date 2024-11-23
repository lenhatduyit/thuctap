import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddExerciseSegment = () => {
  const [formData, setFormData] = useState({
    exercise_id: "",
    segment_number: "",
    audio_file: "",
    transcript: "",
  });
  const navigate = useNavigate();

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gửi dữ liệu đến API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/exercise_segments", formData);

      if (response.status === 200) {
        alert(response.data.message);
        navigate("/exercisesegment"); // Quay lại danh sách sau khi thêm thành công
      }
    } catch (err) {
      console.error("Error adding exercise segment:", err.message);
      alert("Failed to add exercise segment. Please check the input fields.");
    }
  };

  return (
    <div>
      <div className="m-2 text-red-700">
        <Link to="/exercisesegment">
          <strong>&#8592; Back</strong>
        </Link>
        <hr />
      </div>
      <div className="pl-10 pt-4 pr-10">
        <form className="w-full max-w-lg" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="exercise_id"
              >
                Exercise ID
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="exercise_id"
                name="exercise_id"
                type="number"
                value={formData.exercise_id}
                onChange={handleInputChange}
                placeholder="Enter Exercise ID"
                required
              />
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="segment_number"
              >
                Segment Number
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="segment_number"
                name="segment_number"
                type="number"
                value={formData.segment_number}
                onChange={handleInputChange}
                placeholder="Enter Segment Number"
                required
              />
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="audio_file"
              >
                Audio File
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="audio_file"
                name="audio_file"
                type="text"
                value={formData.audio_file}
                onChange={handleInputChange}
                placeholder="Enter Audio File URL"
                required
              />
              <label
                className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2"
                htmlFor="transcript"
              >
                Transcript
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="transcript"
                name="transcript"
                type="text"
                value={formData.transcript}
                onChange={handleInputChange}
                placeholder="Enter Transcript"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 ml-6 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          >
            Add New Exercise Segment
          </button>
        </form>
        <hr />
      </div>
    </div>
  );
};

export default AddExerciseSegment;

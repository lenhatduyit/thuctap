import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AddEnglishExpress = () => {
  const [expressName, setExpressName] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [message, setMessage] = useState(""); // Thông báo sau khi gửi dữ liệu
  const navigate = useNavigate();

  // Hàm xử lý khi thay đổi input expressName
  const handleExpressNameChange = (e) => {
    setExpressName(e.target.value);
  };

  // Hàm xử lý khi thay đổi input videoFile
  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.value);
  };

  // Hàm gửi dữ liệu tới API khi nhấn nút "Add New"
  const handleAddNew = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường chưa được điền đầy đủ
    if (!expressName || !videoFile) {
      setMessage("Please fill in all fields!");
      return;
    }

    try {
      // Gửi dữ liệu qua API
      const response = await axios.post("http://localhost:5000/api/english_expressions", {
        express_name: expressName,
        video_file: videoFile,
      });

      // Xử lý phản hồi khi thêm thành công
      setMessage(response.data.message);
      // Sau khi thêm thành công, điều hướng đến trang khác (ví dụ trang danh sách topic)
      setTimeout(() => {
        navigate("/englishexpress"); // Điều hướng về trang danh sách sau 2 giây
      }, 2000);

    } catch (error) {
      // Xử lý lỗi nếu có
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <div className="m-2 text-red-700">
        <Link to="/englishexpress">
          <strong>&#8592; Back</strong>
        </Link>
        <hr />
      </div>
      <div className="pl-10 pt-4 pr-10">
        <form className="w-full max-w-lg" onSubmit={handleAddNew}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2" htmlFor="express-name">
                Name
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="express-name"
                type="text"
                value={expressName}
                onChange={handleExpressNameChange}
                placeholder="Type expression name..."
              />

              <label className="block uppercase tracking-wide text-purple-500 text-xs font-bold mb-2" htmlFor="video-file">
                Video File
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-purple-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="video-file"
                type="text"
                value={videoFile}
                onChange={handleVideoFileChange}
                placeholder="Type video file name..."
              />
            </div>
            <button
              type="submit"
              className="mt-6 ml-3 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Add New
            </button>
          </div>
        </form>
        {message && <div className="mt-4 text-center text-green-500">{message}</div>}
        <hr />
      </div>
    </div>
  );
};

export default AddEnglishExpress;

import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LearnTogether = () => {
  const [learnTogetherData, setLearnTogetherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const selectionsettings = { persistSelection: true };
  const toolbarOptions = [''];
  const editing = { allowDeleting: true, allowEditing: true };

  // Fetch data from API
  useEffect(() => {
    const fetchLearnTogetherData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/learn_together');
        setLearnTogetherData(response.data);
      } catch (err) {
        console.error('Failed to fetch Learn Together data:', err.message);
        alert('Could not fetch Learn Together data from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchLearnTogetherData();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/learn_together/${id}`);
      if (response.status === 200) {
        alert(response.data.message);
        setLearnTogetherData(learnTogetherData.filter((item) => item.id_learn !== id));
      }
    } catch (err) {
      console.error('Failed to delete Learn Together:', err.message);
      alert('Failed to delete Learn Together data.');
    }
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "save") {
      // Dữ liệu cập nhật từ Grid
      const updatedData = args.data;
  
      try {
        const response = await axios.put(
          `http://localhost:5000/api/learn_together/${updatedData.id_learn}`,
          updatedData
        );
  
        if (response.status === 200) {
          alert(response.data.message); // Hiển thị thông báo thành công
        }
      } catch (error) {
        console.error("Error updating exercise segment:", error.message);
        alert("Failed to update exercise segment. Please try again.");
      }
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Learn Together Management" />
      <Link to="/addlearntogether" className="p-1">
        <span className="inline"><strong>&#10010; Add Learn Together</strong></span>
      </Link>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isEditing && (
            <div className="edit-form">
              <h3>Edit Learn Together</h3>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  value={editingData.title_name}
                  onChange={(e) => setEditingData({ ...editingData, title_name: e.target.value })}
                />
              </div>
              <div>
                <label>Learn Link:</label>
                <input
                  type="text"
                  value={editingData.learn_link}
                  onChange={(e) => setEditingData({ ...editingData, learn_link: e.target.value })}
                />
              </div>
              <div>
                <label>Language:</label>
                <input
                  type="text"
                  value={editingData.language}
                  onChange={(e) => setEditingData({ ...editingData, language: e.target.value })}
                />
              </div>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
          <GridComponent
            dataSource={learnTogetherData}
            enableHover={false}
            allowPaging
            pageSettings={{ pageCount: 5 }}
            selectionSettings={selectionsettings}
            toolbar={toolbarOptions}
            editSettings={editing}
            allowSorting
            actionComplete={handleActionComplete} // Xử lý cập nhật
          >
            <ColumnsDirective>
              <ColumnDirective field="id_learn" headerText="ID" width={80} textAlign="Left" isPrimaryKey={true} />
              <ColumnDirective field="title_name" headerText="Title Name" width={200} textAlign="Left" />
              <ColumnDirective field="learn_link" headerText="Learn Link" width={300} textAlign="Left" />
              <ColumnDirective field="language" headerText="Language" width={300} textAlign="Left" />
              <ColumnDirective
                headerText="Action"
                width={200}
                textAlign="Center"
                template={(props) => (
                  <div>
                    <button
                      onClick={() => handleDelete(props.id_learn)}
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            </ColumnsDirective>
            <Inject services={[Page, Selection, Edit, Sort, Filter]} />
          </GridComponent>
        </>
      )}
    </div>
  );
};

export default LearnTogether;

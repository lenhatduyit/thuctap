import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Exercise = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: true, allowEditing: true };

  // Fetch exercises data
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/exercises');
        setExerciseData(response.data);
      } catch (err) {
        console.error('Failed to fetch exercises:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Handle delete functionality
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this exercise?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/exercises/${id}`);
      if (response.status === 200) {
        alert(response.data.message);
        // Remove deleted item from UI
        setExerciseData(exerciseData.filter((item) => item.exercise_id !== id));
      }
    } catch (err) {
      console.error('Failed to delete exercise:', err.message);
      alert(err.response?.data?.error || 'Failed to delete exercise');
    }
  };
   // Handle update functionality
   const handleUpdate = async (args) => {
    if (args.requestType === 'save') {
      const updatedData = args.data; // Dữ liệu sau khi chỉnh sửa
      try {
        const response = await axios.put(`http://localhost:5000/api/exercises/${updatedData.exercise_id}`, {
          topic_id: updatedData.topic_id,
          title: updatedData.title,
        });
        if (response.status === 200) {
          alert(response.data.message);
          // Cập nhật dữ liệu hiển thị
          setExerciseData((prevData) =>
            prevData.map((item) =>
              item.exercise_id === updatedData.exercise_id ? updatedData : item
            )
          );
        }
      } catch (err) {
        console.error('Failed to update exercise:', err.message);
        alert(err.response?.data?.error || 'Failed to update exercise');
      }
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Exercise Management" />
      <Link to="/addexercise" className="p-1">
        <span className="inline"><strong>&#10010; Add Exercise</strong></span>
      </Link>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <GridComponent
          dataSource={exerciseData}
          enableHover={false}
          allowPaging
          pageSettings={{ pageCount: 5 }}
          selectionSettings={selectionsettings}
          toolbar={toolbarOptions}
          editSettings={editing}
          allowSorting
          actionComplete={handleUpdate} // Xử lý sự kiện cập nhật
        >
          <ColumnsDirective>
            <ColumnDirective field="exercise_id" headerText="ID" width={80} textAlign="Left" isPrimaryKey={true} />
            <ColumnDirective field="topic_id" headerText="Topic Id" width={150} textAlign="Left" />
            <ColumnDirective field="title" headerText="Title" width={200} textAlign="Center" />
            <ColumnDirective
              field="created_at"
              headerText="Created At"
              width={150}
              textAlign="Center"
              template={(props) =>
                props.created_at ? new Date(props.created_at).toLocaleString() : 'N/A'
              }
            />
            <ColumnDirective
              field="updated_at"
              headerText="Updated At"
              width={150}
              textAlign="Center"
              template={(props) =>
                props.updated_at ? new Date(props.updated_at).toLocaleString() : 'N/A'
              }
            />
            <ColumnDirective
              headerText="Action"
              width={200}
              textAlign="Center"
              template={(props) => (
                <div>
                  <button
                    onClick={() => handleDelete(props.exercise_id)}
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
      )}
    </div>
  );
};

export default Exercise;

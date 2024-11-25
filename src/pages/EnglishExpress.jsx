import React, { useState, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EnglishExpress = () => {
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: true, allowEditing: true, mode: 'Dialog' }; // Chỉnh sửa qua dialog

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/english_expressions");
        if (!response.ok) throw new Error('Failed to fetch topics');
        const data = await response.json();
        setTopicsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Nếu đang tải dữ liệu, hiển thị loading
  if (loading) return <div>Loading...</div>;

  // Nếu có lỗi, hiển thị lỗi
  if (error) return <div>Error: {error}</div>;

  // Xóa dữ liệu
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expression?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/english_expressions/${id}`);
      alert(response.data.message); // Hiển thị thông báo thành công
      setTopicsData(topicsData.filter(topic => topic.id_express !== id)); // Cập nhật lại dữ liệu sau khi xóa
    } catch (error) {
      alert('Error deleting the expression'); // Thông báo lỗi nếu xóa thất bại
    }
  };

  // Cập nhật thông tin chỉnh sửa
  const handleActionComplete = async (args) => {
    if (args.requestType === 'save') {
      // Handle the updated data here
      const updatedTopic = args.data;
      try {
        const response = await fetch(`http://localhost:5000/api/english_expressions/${updatedTopic.id_express}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTopic),
        });

        const result = await response.json();
        if (response.ok) {
          alert(`Cập nhật thành công: ${result.message}`);
          setTopicsData((prevTopics) =>
            prevTopics.map((topic) =>
              topic.id_express === updatedTopic.id_express ? updatedTopic : topic
            )
          );
        } else {
          alert(`Lỗi: ${result.error}`);
        }
      } catch (error) {
        alert('Lỗi khi cập nhật chủ đề: ' + error.message);
      }
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="English Express & English Pronunciation Management" />
      <Link to="/addenglishexpress" className='p-1'>
        <span className='inline'><strong>&#10010; Add English Express & English Pronunciation</strong></span>
      </Link>
      <GridComponent
        dataSource={topicsData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
        toolbarClick={(args) => {
          if (args.item.id === 'Delete') {
            const selectedRecords = args.grid.getSelectedRecords();
            if (selectedRecords.length === 0) {
              alert('Please select at least one record to delete.');
              return;
            }
            selectedRecords.forEach((record) => {
              handleDelete(record.id_express);
            });
          }
        }}
        actionComplete={handleActionComplete}  // This is where we handle the update
      >
        <ColumnsDirective>
          <ColumnDirective field="id_express" headerText="ID" width={50} textAlign="Left" isPrimaryKey={true} />
          <ColumnDirective field="express_name" headerText="Express Name" width={150} textAlign="Left" />
          <ColumnDirective field="video_file" headerText="Video File" width={120} textAlign="Center" />
          <ColumnDirective field="created_at" headerText="Created At" width={150} textAlign="Center" />
          <ColumnDirective field="updated_at" headerText="Updated At" width={150} textAlign="Center" />
          <ColumnDirective
            headerText="Action"
            width={100}
            textAlign="Center"
            template={(props) => (
              <div>
                <button
                  onClick={() => handleDelete(props.id_express)}
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
    </div>
  );
};

export default EnglishExpress;

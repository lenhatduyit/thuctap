import React, { useState, useEffect } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Page, Toolbar, Selection, Edit } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { Link } from 'react-router-dom';

const Topic = () => {
  const [topicsData, setTopicsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toolbarOptions = ['Search'];
  const editing = { allowEditing: true, allowDeleting: true, mode: 'Dialog' };  // Inline editing enabled here
  const gridRef = React.useRef(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/topics");
        if (!response.ok) throw new Error('Failed to fetch topics');
        const data = await response.json();
        setTopicsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (topicsData.length === 0) return <div>No topics available.</div>;

  const handleDelete = async (topic_id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa chủ đề này không?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/topics/${topic_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Xóa thành công: ${result.message}. Số lượng bản ghi đã xóa: ${result.deletedCount}`);
        setTopicsData((prevTopics) => prevTopics.filter((topic) => topic.topic_id !== topic_id));
      } else {
        const result = await response.json();
        alert(`Không thể xóa chủ đề: ${result.error}`);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === 'save') {
      // Handle the updated data here
      const updatedTopic = args.data;
      try {
        const response = await fetch(`http://localhost:5000/api/topics/${updatedTopic.topic_id}`, {
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
              topic.topic_id === updatedTopic.topic_id ? updatedTopic : topic
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
      <Header category="Page" title="Topic Management" />
      <Link to="/addtopic" className="p-1">
        <span className="inline"><strong>&#10010; Add Topic</strong></span>
      </Link>
      <GridComponent
        ref={gridRef}
        dataSource={topicsData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        selectionSettings={{ type: 'Multiple', mode: 'Row' }}
        toolbarClick={(args) => {
          if (args.item.id === 'Delete') {
            const selectedRecords = gridRef.current.getSelectedRecords();
            if (selectedRecords.length === 0) {
              alert('Please select at least one record to delete.');
              return;
            }
            const idsToDelete = selectedRecords.map((record) => record.topic_id);
            idsToDelete.forEach((id) => handleDelete(id));
          }
        }}
        actionComplete={handleActionComplete}  // This is where we handle the update
      >
        <ColumnsDirective>
          <ColumnDirective field="topic_id" headerText="ID" width={80} textAlign="Left" isPrimaryKey={true} />
          <ColumnDirective field="name" headerText="Name" width={150} textAlign="Left" />
          <ColumnDirective field="level" headerText="Level" width={120} textAlign="Center" />
          <ColumnDirective field="description" headerText="Description" width={200} textAlign="Left" />
          <ColumnDirective
            field="created_at"
            headerText="Created At"
            width={150}
            textAlign="Center"
            template={(props) => new Date(props.created_at).toLocaleString()}
          />
          <ColumnDirective
            field="updated_at"
            headerText="Updated At"
            width={150}
            textAlign="Center"
            template={(props) => new Date(props.updated_at).toLocaleString()}
          />
          <ColumnDirective
            headerText="Action"
            width={200}
            textAlign="Center"
            template={(props) => (
              <div>
    
                <button
                  onClick={() => handleDelete(props.topic_id)}
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
        <Inject services={[Page, Toolbar, Selection, Edit]} />
      </GridComponent>
    </div>
  );
};

export default Topic;

import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Englishpronunciation = () => {
  const [Englishpronunciations, setEnglishpronunciations] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectionsettings = { persistSelection: true };
  const toolbarOptions = ['Search'];
  const editing = { allowDeleting: true, allowEditing: true };

  useEffect(() => {
    const fetchExerciseSegments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/english_pronunciation');
        console.log(response.data);  // Kiểm tra dữ liệu trả về
        setEnglishpronunciations(response.data); 
      } catch (err) {
        console.error('Error fetching exercise segments:', err.message);
        alert('Could not fetch exercise segments from the server.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchExerciseSegments();
  }, []);
  
  const handleDelete = async (id_pronun ) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa chủ đề này không?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/english_pronunciation/${id_pronun }`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Xóa thành công: ${result.message}. Số lượng bản ghi đã xóa: ${result.deletedCount}`);
        setTopicsData((prevTopics) => prevTopics.filter((topic) => topic.id_pronun  !== id_pronun ));
      } else {
        const result = await response.json();
        alert(`Không thể xóa chủ đề: ${result.error}`);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "save") {
      // Dữ liệu cập nhật từ Grid
      const updatedData = args.data;
  
      try {
        const response = await axios.put(
          `http://localhost:5000/api/english_pronunciation/${updatedData.id_pronun }`,
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
      <Header category="Page" title="Exercise Segment Management" />
      <Link to="/addEnglishPro" className="p-1">
        <span className="inline"><strong>&#10010; Add </strong></span>
      </Link><br />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <GridComponent
          dataSource={Englishpronunciations}
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
            <ColumnDirective field="id_pronun" headerText="ID" width="150" textAlign="Left" />
            <ColumnDirective field="pronun_name" headerText="Pronun_name" width="150" textAlign="Left" />
            <ColumnDirective field="video_file" headerText="Video_file" width="150" textAlign="Left" />
            <ColumnDirective field="created_at" headerText="Created At" width="150" textAlign="Left" />
            <ColumnDirective field="updated_at" headerText="Updated At" width="150" textAlign="Left" />
            <ColumnDirective
              headerText="Action"
              width={200}
              textAlign="Center"
              template={(props) => (
                <div>
      
                  <button
                    onClick={() => handleDelete(props.id_pronun)}
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

export default Englishpronunciation;

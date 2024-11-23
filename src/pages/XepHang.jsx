import React, { useState, useEffect } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Page, Toolbar, Selection, Edit } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';

const XepHang = () => {
  const [XepHangs, setXepHangs] = useState([]);  // Dữ liệu được lưu trong biến này
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toolbarOptions = ['Search'];  // Thêm 'Search' vào thanh công cụ
  const editing = { allowEditing: true, allowDeleting: true, mode: 'Dialog' };  // Cho phép chỉnh sửa và xóa
  const gridRef = React.useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/public_profile");
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();

        // Thêm số thứ tự vào dữ liệu
        const dataWithIndex = data.map((item, index) => ({
          ...item,
          index: index + 1 // Thêm trường 'index' để hiển thị số thứ tự
        }));

        setXepHangs(dataWithIndex);  // Lưu dữ liệu vào XepHangs
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Xử lý lỗi tải dữ liệu
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (XepHangs.length === 0) return <div>No users available.</div>;

  // Đặt chức năng xử lý toolbarClick nếu cần
  const handleToolbarClick = (args) => {
    if (args.item.id === 'Delete') {
      // Xử lý sự kiện xóa tại đây
      alert('Delete button clicked');
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Xếp Hạng" />
      <GridComponent
        ref={gridRef}
        dataSource={XepHangs}  // Sử dụng XepHangs thay vì Users
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        selectionSettings={{ type: 'Multiple', mode: 'Row' }}
        toolbarClick={handleToolbarClick}  // Gọi hàm khi nhấn vào toolbar
      >
        <ColumnsDirective>
          {/* Cột số thứ tự */}
          <ColumnDirective field="index" headerText="STT" width="100" textAlign="Left" />

          <ColumnDirective field="username" headerText="Name" width="150" textAlign="Left" />
          <ColumnDirective field="active_time_hours" headerText="Time" width="150" textAlign="Left" />
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit]} />
      </GridComponent>
    </div>
  );
};

export default XepHang;

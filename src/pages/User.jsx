import React, { useState, useEffect } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Page, Toolbar, Selection, Edit } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';

const User = () => {
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toolbarOptions = ['Search'];  // Thêm 'Delete' vào thanh công cụ
  const editing = { allowEditing: true, allowDeleting: true, mode: 'Dialog' };  // Inline editing enabled here
  const gridRef = React.useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users_account");
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
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
  if (Users.length === 0) return <div>No users available.</div>;

  const handleDelete = async (user_id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users_account/${user_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Xóa thành công: ${result.message}. Số lượng bản ghi đã xóa: ${result.deletedCount}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== user_id));
      } else {
        const result = await response.json();
        alert(`Không thể xóa người dùng: ${result.error}`);
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleSendNotification = async () => {
    // Chắc chắn rằng ít nhất một người dùng được chọn
    const selectedRecords = gridRef.current.getSelectedRecords();
    if (selectedRecords.length === 0) {
      alert('Vui lòng chọn ít nhất một người dùng để gửi thông báo.');
      return;
    }
  
    // Lấy thông tin người dùng đã chọn
    const userIds = selectedRecords.map((user) => user.user_id);
  
    try {
      const response = await fetch('http://localhost:5000/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: userIds, // Dữ liệu người dùng
          message: 'Bạn có một thông báo mới từ hệ thống!', // Nội dung thông báo
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Thông báo đã được gửi thành công.');
      } else {
        const result = await response.json();
        alert(`Lỗi khi gửi thông báo: ${result.error}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi thông báo: ' + error.message);
    }
  };

  // Xử lý khi người dùng click vào toolbar 'Delete'
  const handleToolbarClick = (args) => {
    if (args.item.id === 'Delete') {
      const selectedRecords = gridRef.current.getSelectedRecords();
      if (selectedRecords.length === 0) {
        alert('Vui lòng chọn ít nhất một bản ghi để xóa.');
        return;
      }
      selectedRecords.forEach((record) => {
        handleDelete(record.user_id);
      });
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Topic Management" />
      
      {/* Nút Gửi Thông Báo nằm ngoài GridComponent */}
      <div className="notification-button-container">
        <button
          onClick={handleSendNotification}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            marginTop: '20px',
            cursor: 'pointer',
          }}
        >
          Send Notification
        </button>
      </div>

      <GridComponent
        ref={gridRef}
        dataSource={Users}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        selectionSettings={{ type: 'Multiple', mode: 'Row' }}
        toolbarClick={handleToolbarClick}  // Đổi tên thành 'handleToolbarClick'
      >
        <ColumnsDirective>
          <ColumnDirective field="user_id" headerText="ID" width="50" textAlign="Left" />
          <ColumnDirective field="username" headerText="User Name" width="150" textAlign="Left" />
          <ColumnDirective field="email" headerText="Email" width="150" textAlign="Left" />
          <ColumnDirective field="password_hash" headerText="Password" width="150" textAlign="Left" />
          <ColumnDirective field="google_login" headerText="Google Login" width="150" textAlign="Left" />
          <ColumnDirective field="join_date" headerText="Join Date" width="150" textAlign="Left" visible={false}/>
          <ColumnDirective field="updated_at" headerText="Updated At" width="100" textAlign="Left" visible={false}/>
          <ColumnDirective field="total_days" headerText="Total_days" width="100" textAlign="Left" visible={false} />
          <ColumnDirective field="active_days" headerText="Active_days" width="100" textAlign="Left" visible={false} />
          <ColumnDirective field="inactive_days" headerText="Inactive_days" width="100" textAlign="Left" visible={false} />
          <ColumnDirective
            headerText="Action"
            width={80}
            textAlign="Center"
            template={(props) => (
              <div>
                <button
                  onClick={() => handleDelete(props.user_id)}
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

export default User;

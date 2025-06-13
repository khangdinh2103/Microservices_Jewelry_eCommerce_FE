import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">      
      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto pt-12 bg-gray-100">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
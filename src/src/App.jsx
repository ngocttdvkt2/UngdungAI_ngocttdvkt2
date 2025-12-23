import React, { useState } from 'react';

const App = () => {
  const [tasks] = useState([
    { id: 1, time: '08:00', content: 'Họp giao ban đầu tuần', room: 'Phòng họp A' },
    { id: 2, time: '10:30', content: 'Làm việc với đối tác AI', room: 'Phòng khách' },
    { id: 3, time: '14:00', content: 'Kiểm tra tiến độ dự án Vercel', room: 'Trực tuyến' },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wide">Lịch Công Tác Tuần</h1>
          <p className="mt-2 opacity-80">Thời gian: Thứ Hai, ngày 23/12/2025</p>
        </div>

        {/* Nội dung lịch */}
        <div className="p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border p-3 text-left w-24">Giờ</th>
                <th className="border p-3 text-left">Nội dung công việc</th>
                <th className="border p-3 text-left w-32">Địa điểm</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-blue-50 transition-colors">
                  <td className="border p-3 font-semibold text-blue-600">{task.time}</td>
                  <td className="border p-3 text-gray-800">{task.content}</td>
                  <td className="border p-3 text-gray-600 italic">{task.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
          &copy; 2025 - Ứng dụng quản lý công tác
        </div>
      </div>
    </div>
  );
};

export default App;

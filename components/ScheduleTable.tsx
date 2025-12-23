
import React, { useState, useEffect } from 'react';
import type { ScheduleDay, ScheduleEvent } from '../types';
import VideoCameraIcon from './icons/VideoCameraIcon';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import NewIcon from './icons/NewIcon';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';


interface ScheduleTableProps {
  day: ScheduleDay;
  isToday: boolean;
  onAddEvent: (event: Omit<ScheduleEvent, 'id' | 'detailedParticipants' | 'isOnlineMeeting'>) => void;
  onEditEvent: (event: ScheduleEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ day, isToday, onAddEvent, onEditEvent, onDeleteEvent }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Update time every 10 seconds to check for "new" status expiry

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSaveAddEvent = (event: Omit<ScheduleEvent, 'id' | 'detailedParticipants' | 'isOnlineMeeting'>) => {
    onAddEvent(event);
    setIsAddModalOpen(false);
  };

  const handleEditClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (eventId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này không?')) {
      onDeleteEvent(eventId);
    }
  };

  const handleSaveEditEvent = (event: ScheduleEvent) => {
    onEditEvent(event);
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };
  
  return (
    <>
      <AddEventModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAddEvent}
      />
      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEditEvent}
        event={selectedEvent}
      />
      <div className="overflow-hidden border border-gray-300 rounded-md shadow-sm">
        <div
          className={`px-4 py-2 font-bold text-gray-800 text-lg flex justify-between items-center ${
            isToday ? 'bg-yellow-100' : 'bg-blue-200'
          }`}
        >
          <div>
            {day.dayOfWeek.toUpperCase()} ({day.date})
            {isToday && <span className="ml-2 text-red-600 font-semibold text-base">(Hôm nay)</span>}
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={`Thêm sự kiện cho ${day.dayOfWeek}`}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Thêm sự kiện</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[15%]">
                  T.Gian / Đ.Điểm
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[25%]">
                  Nội dung
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[12%]">
                  Chuẩn bị
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[15%]">
                  Chủ trì
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[15%]">
                  Thành phần
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[10%]">
                  Chi tiết
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-[8%]">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {day.events.length > 0 ? (
                day.events.map((event) => {
                  const NEW_DURATION_MS = 5 * 60 * 1000; // 5 minutes
                  const isNew = event.lastModified && (currentTime - event.lastModified < NEW_DURATION_MS);

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 align-top border-r border-gray-200">
                        <div className="text-sm font-semibold text-blue-700">{event.time}</div>
                        <div className="text-sm font-bold text-gray-900">{event.location}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 align-top border-r border-gray-200">
                        <div className="flex items-start">
                          {event.isOnlineMeeting && <VideoCameraIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />}
                          <span>
                            {event.content}
                            {isNew && <NewIcon />}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 align-top border-r border-gray-200">{event.preparation}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 align-top border-r border-gray-200">{event.host}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 align-top border-r border-gray-200">{event.participants}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 align-top border-r border-gray-200">
                        {event.detailedParticipants ? (
                          <div>
                            <div>{event.detailedParticipants.text}</div>
                            {event.detailedParticipants.link && (
                              <a href="#" className="text-blue-600 hover:underline font-semibold">
                                {event.detailedParticipants.link}
                              </a>
                            )}
                          </div>
                        ) : (
                          <span></span>
                        )}
                      </td>
                      <td className="px-4 py-4 align-top text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleEditClick(event)} 
                            className="text-blue-600 hover:text-blue-800"
                            aria-label={`Chỉnh sửa sự kiện ${event.content}`}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                           <button 
                            onClick={() => handleDeleteClick(event.id)} 
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Xóa sự kiện ${event.content}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                    Không có lịch trình cho ngày này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ScheduleTable;

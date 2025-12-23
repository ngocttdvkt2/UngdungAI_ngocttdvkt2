
import React, { useState, useEffect } from 'react';
import type { ScheduleEvent } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<ScheduleEvent, 'id' | 'detailedParticipants' | 'isOnlineMeeting'>) => void;
}

const initialEventState: Omit<ScheduleEvent, 'id' | 'detailedParticipants' | 'isOnlineMeeting'> = {
  time: '',
  location: '',
  content: '',
  preparation: '',
  host: '',
  participants: '',
};

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [event, setEvent] = useState(initialEventState);

  useEffect(() => {
    if (isOpen) {
      setEvent(initialEventState);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" aria-label="Đóng">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm sự kiện mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Thời gian</label>
              <input type="text" name="time" id="time" value={event.time} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="VD: 09:00 - 10:00" required />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm</label>
              <input type="text" name="location" id="location" value={event.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="VD: Phòng họp A" required />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Nội dung</label>
            <textarea name="content" id="content" value={event.content} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="mb-4">
              <label htmlFor="preparation" className="block text-sm font-medium text-gray-700">Chuẩn bị</label>
              <input type="text" name="preparation" id="preparation" value={event.preparation} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div className="mb-4">
              <label htmlFor="host" className="block text-sm font-medium text-gray-700">Chủ trì</label>
              <input type="text" name="host" id="host" value={event.host} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="participants" className="block text-sm font-medium text-gray-700">Thành phần</label>
            <input type="text" name="participants" id="participants" value={event.participants} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;

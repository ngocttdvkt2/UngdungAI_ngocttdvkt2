
import React, { useState, useEffect } from 'react';
import type { ScheduleDay, ScheduleEvent } from './types';
import ScheduleTable from './components/ScheduleTable';
import { getSchedule, saveSchedule } from './db';

const App: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const monday = getMonday(new Date());
        const weekId = monday.toISOString().split('T')[0]; // Unique ID for the current week
        
        const storedSchedule = await getSchedule(weekId);

        if (storedSchedule) {
          setScheduleData(storedSchedule);
        } else {
          // If no data for the current week, generate a blank schedule
          const vietnameseDays = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
          const newWeekData: ScheduleDay[] = [];
          for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            newWeekData.push({
              date: formatDate(day),
              dayOfWeek: vietnameseDays[i],
              events: []
            });
          }
          setScheduleData(newWeekData);
          await saveSchedule(weekId, newWeekData); // Save the new blank week to DB
        }
      } catch (error) {
        console.error("Failed to load or initialize schedule data:", error);
        // Fallback to a blank schedule if IndexedDB fails
        setScheduleData([]);
      }
    };
    
    loadSchedule();
  }, []);

  const persistSchedule = async (newSchedule: ScheduleDay[]) => {
    try {
      const monday = getMonday(new Date());
      const weekId = monday.toISOString().split('T')[0];
      await saveSchedule(weekId, newSchedule);
    } catch (error) {
      console.error("Failed to save schedule data:", error);
    }
  };


  const handleAddEvent = async (dayIndex: number, newEventData: Omit<ScheduleEvent, 'id' | 'detailedParticipants' | 'isOnlineMeeting'>) => {
    const newSchedule = [...scheduleData];
    const newEvent: ScheduleEvent = {
      ...newEventData,
      id: `event-${Date.now()}-${Math.random()}`,
      lastModified: Date.now(),
    };
    newSchedule[dayIndex].events.push(newEvent);
    setScheduleData(newSchedule);
    await persistSchedule(newSchedule);
  };

  const handleEditEvent = async (dayIndex: number, updatedEvent: ScheduleEvent) => {
    const newSchedule = [...scheduleData];
    newSchedule[dayIndex].events = newSchedule[dayIndex].events.map(event => 
      event.id === updatedEvent.id ? { ...updatedEvent, lastModified: Date.now() } : event
    );
    setScheduleData(newSchedule);
    await persistSchedule(newSchedule);
  };

  const handleDeleteEvent = async (dayIndex: number, eventId: string) => {
    const newSchedule = [...scheduleData];
    newSchedule[dayIndex].events = newSchedule[dayIndex].events.filter(event => event.id !== eventId);
    setScheduleData(newSchedule);
    await persistSchedule(newSchedule);
  };

  const getWeekRange = () => {
    const today = new Date();
    const monday = getMonday(today);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: formatDate(monday),
      end: formatDate(sunday)
    };
  };

  const weekRange = getWeekRange();
  const todayString = formatDate(new Date());

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <header className="text-center mb-8">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 uppercase">
          Đội Sửa Chữa Thí Nghiệm Điện 2
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-blue-700 uppercase mt-1">
          Lịch Công Tác Tuần
        </h2>
        <p className="text-md sm:text-lg text-gray-700 font-semibold mt-1">
          (Từ ngày {weekRange.start} đến ngày {weekRange.end})
        </p>
      </header>
      <div className="space-y-8">
        {scheduleData.map((day: ScheduleDay, index: number) => (
          <ScheduleTable 
            key={day.date} 
            day={day} 
            isToday={day.date === todayString}
            onAddEvent={(newEvent) => handleAddEvent(index, newEvent)}
            onEditEvent={(updatedEvent) => handleEditEvent(index, updatedEvent)}
            onDeleteEvent={(eventId) => handleDeleteEvent(index, eventId)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;

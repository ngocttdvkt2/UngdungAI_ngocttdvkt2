
export interface ScheduleEvent {
  id: string;
  time: string;
  location: string;
  content: string;
  isOnlineMeeting?: boolean;
  preparation: string;
  host: string;
  participants: string;
  detailedParticipants?: {
    text: string;
    link?: string;
  };
  lastModified?: number;
}

export interface ScheduleDay {
  date: string;
  dayOfWeek: string;
  events: ScheduleEvent[];
}

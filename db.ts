
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { ScheduleDay } from './types';

const DB_NAME = 'WeeklyScheduleDB';
const STORE_NAME = 'schedules';
const DB_VERSION = 1;

interface ScheduleDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: {
      weekId: string;
      schedule: ScheduleDay[];
    };
  };
}

let dbPromise: Promise<IDBPDatabase<ScheduleDB>> | null = null;

const initDB = () => {
  if (dbPromise) return dbPromise;
  
  dbPromise = openDB<ScheduleDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'weekId' });
      }
    },
  });
  return dbPromise;
};

export const getSchedule = async (weekId: string): Promise<ScheduleDay[] | null> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const result = await store.get(weekId);
  await tx.done;
  return result ? result.schedule : null;
};

export const saveSchedule = async (weekId: string, schedule: ScheduleDay[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({ weekId, schedule });
  await tx.done;
};

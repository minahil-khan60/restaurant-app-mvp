import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  mockTables,
  mockReservations,
} from '../data/reservations';

const STORAGE_KEY = 'restaurant_reservations';

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const timeSlots = Array.from(
  { length: 11 },
  (_, index) => `${String(index + 12).padStart(2, '0')}:00`
);

export default function useReservation() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [timeSlot, setTimeSlot] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [table, setTable] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [reservations, setReservations] = useState(mockReservations);
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Load saved reservations when the hook starts
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);

        if (savedData !== null) {
          setReservations(JSON.parse(savedData));
        }
      } catch (error) {
        console.log('Error loading reservations:', error);
      } finally {
        setStorageLoaded(true);
      }
    };

    loadReservations();
  }, []);

  // Save reservations whenever the list changes
  useEffect(() => {
    if (!storageLoaded) return;

    const saveReservations = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(reservations)
        );
      } catch (error) {
        console.log('Error saving reservations:', error);
      }
    };

    saveReservations();
  }, [reservations, storageLoaded]);

  const availableTables = mockTables.filter((item) => {
    if (!timeSlot) return false;

    const booked = reservations.some(
      (reservation) =>
        reservation.date === selectedDate &&
        reservation.time === timeSlot &&
        reservation.tableId === item.id
    );

    return (
      item.seats >= Number(partySize) &&
      Number(partySize) >= 1 &&
      Number(partySize) <= 12 &&
      !booked
    );
  });

  const availableSlots = timeSlots.filter((slot) =>
    mockTables.some((item) => {
      const booked = reservations.some(
        (reservation) =>
          reservation.date === selectedDate &&
          reservation.time === slot &&
          reservation.tableId === item.id
      );

      return item.seats >= Number(partySize) && !booked;
    })
  );

  const createReservation = () => {
    if (
      !selectedDate ||
      !timeSlot ||
      !table ||
      !contactName.trim() ||
      !phone.trim()
    ) {
      return {
        success: false,
        message: 'Please complete all booking fields.',
      };
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) ||
      selectedDate < getToday()
    ) {
      return {
        success: false,
        message: 'Select a valid date that is not in the past.',
      };
    }

    const bookingDate = new Date(`${selectedDate}T${timeSlot}:00`);

    if (bookingDate.getTime() < Date.now() + 60 * 60 * 1000) {
      return {
        success: false,
        message: 'Booking must be at least one hour ahead.',
      };
    }

    const guests = Number(partySize);

    if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
      return {
        success: false,
        message: 'Guests must be between 1 and 12.',
      };
    }

    if (!/^03\d{2}-\d{7}$/.test(phone)) {
      return {
        success: false,
        message: 'Use phone format 03XX-XXXXXXX.',
      };
    }

    const chosenTable = availableTables.find(
      (item) => item.id === table
    );

    if (!chosenTable) {
      return {
        success: false,
        message: 'Please select an available table.',
      };
    }

    const newReservation = {
      id: Date.now().toString(),
      date: selectedDate,
      time: timeSlot,
      partySize: guests,
      tableId: table,
      tableName: chosenTable.name,
      contactName: contactName.trim(),
      phone,
      status: 'Pending',
    };

    setReservations((previous) => [
      ...previous,
      newReservation,
    ]);

    setTable('');

    return {
      success: true,
      message: 'Your table has been reserved!',
      reservation: newReservation,
    };
  };

  const cancelReservation = (id) => {
    setReservations((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  return {
    selectedDate,
    setSelectedDate,
    timeSlot,
    setTimeSlot,
    partySize,
    setPartySize,
    table,
    setTable,
    contactName,
    setContactName,
    phone,
    setPhone,
    reservations,
    availableTables,
    availableSlots,
    createReservation,
    cancelReservation,
  };
}
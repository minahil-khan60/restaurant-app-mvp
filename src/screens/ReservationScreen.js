import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import useReservation from '../hooks/useReservation';

export default function ReservationScreen() {
  const {
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
  } = useReservation();

  const handleBooking = () => {
    const result = createReservation();

    Alert.alert(
      result.success ? 'Success' : 'Reservation Error',
      result.message
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Reserve Your Table</Text>

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={selectedDate}
        onChangeText={(value) => {
          setSelectedDate(value);
          setTimeSlot('');
          setTable('');
        }}
        placeholder="2026-12-25"
      />

      <Text style={styles.label}>Number of Guests (1–12)</Text>
      <TextInput
        style={styles.input}
        value={partySize}
        onChangeText={(value) => {
          setPartySize(value);
          setTable('');
        }}
        keyboardType="number-pad"
        placeholder="Enter guests"
      />

      <Text style={styles.label}>Select Time</Text>
      <View style={styles.options}>
        {availableSlots.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.option,
              timeSlot === slot && styles.selected,
            ]}
            onPress={() => {
              setTimeSlot(slot);
              setTable('');
            }}
          >
            <Text
              style={[
                styles.optionText,
                timeSlot === slot && styles.selectedText,
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {availableSlots.length === 0 && (
        <Text style={styles.warning}>
          No time slots available for these details.
        </Text>
      )}

      <Text style={styles.label}>Select Table</Text>
      <View style={styles.options}>
        {availableTables.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.option,
              table === item.id && styles.selected,
            ]}
            onPress={() => setTable(item.id)}
          >
            <Text
              style={[
                styles.optionText,
                table === item.id && styles.selectedText,
              ]}
            >
              {item.name} ({item.seats} seats)
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Your Name</Text>
      <TextInput
        style={styles.input}
        value={contactName}
        onChangeText={setContactName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={12}
        placeholder="03XX-XXXXXXX"
      />

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
      >
        <Text style={styles.bookText}>Confirm Reservation</Text>
      </TouchableOpacity>

      <Text style={styles.subheading}>My Reservations</Text>

      {reservations.length === 0 ? (
        <Text style={styles.empty}>No reservations yet.</Text>
      ) : (
        reservations.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.tableName}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Time: {item.time}</Text>
            <Text>Guests: {item.partySize}</Text>
            <Text>Name: {item.contactName}</Text>
            <Text>Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                Alert.alert(
                  'Cancel Reservation',
                  'Do you want to cancel this booking?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Yes, Cancel',
                      style: 'destructive',
                      onPress: () => cancelReservation(item.id),
                    },
                  ]
                )
              }
            >
              <Text style={styles.cancelText}>
                Cancel Reservation
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 18,
    paddingBottom: 35,
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#16834A',
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    backgroundColor: '#E0E0E0',
    padding: 11,
    borderRadius: 8,
    marginBottom: 3,
  },
  selected: {
    backgroundColor: '#16834A',
  },
  optionText: {
    color: '#222222',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  warning: {
    color: '#B00020',
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: '#16834A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  bookText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subheading: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
  },
  empty: {
    color: '#666666',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cancelButton: {
    backgroundColor: '#FCE8E8',
    padding: 10,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: '#B00020',
    fontWeight: 'bold',
  },
});
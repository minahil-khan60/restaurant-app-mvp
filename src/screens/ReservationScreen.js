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
import { useTheme } from '../context/ThemeContext';

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

  const { isDarkMode } = useTheme();

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    card: isDarkMode ? '#242424' : '#FFFFFF',
    input: isDarkMode ? '#303030' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#222222',
    secondary: isDarkMode ? '#BBBBBB' : '#666666',
    border: isDarkMode ? '#484848' : '#CCCCCC',
    option: isDarkMode ? '#383838' : '#E0E0E0',
    green: '#16834A',
    warning: '#FF6B6B',
    cancelBackground: isDarkMode ? '#442626' : '#FCE8E8',
    cancelText: '#FF6B6B',
  };

  const styles = getStyles(colors);

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
        placeholderTextColor={colors.secondary}
      />

      <Text style={styles.label}>Number of Guests (1–12)</Text>
      <TextInput
        style={styles.input}
        value={String(partySize)}
        onChangeText={(value) => {
          setPartySize(value);
          setTable('');
        }}
        keyboardType="number-pad"
        placeholder="Enter guests"
        placeholderTextColor={colors.secondary}
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
        placeholderTextColor={colors.secondary}
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={12}
        placeholder="03XX-XXXXXXX"
        placeholderTextColor={colors.secondary}
      />

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
      >
        <Text style={styles.bookText}>
          Confirm Reservation
        </Text>
      </TouchableOpacity>

      <Text style={styles.subheading}>My Reservations</Text>

      {reservations.length === 0 ? (
        <Text style={styles.empty}>
          No reservations yet.
        </Text>
      ) : (
        reservations.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.tableName}
            </Text>

            <Text style={styles.details}>Date: {item.date}</Text>
            <Text style={styles.details}>Time: {item.time}</Text>
            <Text style={styles.details}>
              Guests: {item.partySize}
            </Text>
            <Text style={styles.details}>
              Name: {item.contactName}
            </Text>
            <Text style={styles.details}>
              Status: {item.status}
            </Text>

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

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 18,
      paddingBottom: 35,
    },
    heading: {
      fontSize: 25,
      fontWeight: 'bold',
      color: colors.green,
      marginBottom: 15,
    },
    label: {
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 14,
      marginBottom: 7,
    },
    input: {
      backgroundColor: colors.input,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
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
      backgroundColor: colors.option,
      padding: 11,
      borderRadius: 8,
      marginBottom: 3,
    },
    selected: {
      backgroundColor: colors.green,
    },
    optionText: {
      color: colors.text,
    },
    selectedText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    warning: {
      color: colors.warning,
      marginTop: 8,
    },
    bookButton: {
      backgroundColor: colors.green,
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
      color: colors.text,
      marginTop: 28,
      marginBottom: 12,
    },
    empty: {
      color: colors.secondary,
    },
    card: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 12,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 6,
    },
    details: {
      color: colors.secondary,
      marginTop: 3,
    },
    cancelButton: {
      backgroundColor: colors.cancelBackground,
      padding: 10,
      borderRadius: 7,
      alignItems: 'center',
      marginTop: 12,
    },
    cancelText: {
      color: colors.cancelText,
      fontWeight: 'bold',
    },
  });
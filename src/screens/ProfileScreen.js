import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';

import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const { isDarkMode, toggleTheme } = useTheme();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    card: isDarkMode ? '#242424' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#222222',
    secondary: isDarkMode ? '#BBBBBB' : '#666666',
    input: isDarkMode ? '#333333' : '#EEEEEE',
    border: isDarkMode ? '#484848' : '#DDDDDD',
    button: '#2E7D32',
  };

  const styles = getStyles(colors);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your name and email.'
      );
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
    });

    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.secondary}
        />

        <Text style={styles.label}>Email Address</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={colors.secondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.themeCard}>
        <View style={styles.themeRow}>
          <View style={styles.themeInfo}>
            <Text style={styles.themeTitle}>Dark Mode</Text>

            <Text style={styles.themeDescription}>
              Switch between light and dark appearance
            </Text>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{
              false: '#BBBBBB',
              true: '#4CAF50',
            }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#F4F3F4'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    heading: {
      fontSize: 26,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    card: {
      backgroundColor: colors.card,
      padding: 18,
      borderRadius: 12,
      marginBottom: 20,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.input,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      borderRadius: 8,
      marginBottom: 18,
      fontSize: 16,
    },
    button: {
      backgroundColor: colors.button,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    themeCard: {
      backgroundColor: colors.card,
      padding: 18,
      borderRadius: 12,
      elevation: 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    themeInfo: {
      flex: 1,
      paddingRight: 10,
    },
    themeTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    themeDescription: {
      fontSize: 13,
      color: colors.secondary,
    },
  });
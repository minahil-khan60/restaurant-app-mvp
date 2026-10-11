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
input: isDarkMode ? '#333333' : '#EEEEEE',
button: '#2E7D32',
};

const handleSave = () => {
if (!name.trim() || !email.trim()) {
Alert.alert('Missing Information', 'Please enter your name and email.');
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
style={{ flex: 1, backgroundColor: colors.background }}
contentContainerStyle={styles.container}
>
<Text style={[styles.heading, { color: colors.text }]}>
My Profile
</Text>

  <View style={[styles.card, { backgroundColor: colors.card }]}>
    <Text style={[styles.label, { color: colors.text }]}>
      Full Name
    </Text>

    <TextInput
      style={[
        styles.input,
        { backgroundColor: colors.input, color: colors.text },
      ]}
      value={name}
      onChangeText={setName}
      placeholder="Enter your name"
      placeholderTextColor={isDarkMode ? '#BBBBBB' : '#777777'}
    />

    <Text style={[styles.label, { color: colors.text }]}>
      Email Address
    </Text>

    <TextInput
      style={[
        styles.input,
        { backgroundColor: colors.input, color: colors.text },
      ]}
      value={email}
      onChangeText={setEmail}
      placeholder="Enter your email"
      placeholderTextColor={isDarkMode ? '#BBBBBB' : '#777777'}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.button }]}
      onPress={handleSave}
    >
      <Text style={styles.buttonText}>Save Profile</Text>
    </TouchableOpacity>
  </View>

  <View style={[styles.themeCard, { backgroundColor: colors.card }]}>
    <View style={styles.themeRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.themeTitle, { color: colors.text }]}>
          Dark Mode
        </Text>

        <Text style={[styles.themeDescription, { color: colors.text }]}>
          Switch between light and dark appearance
        </Text>
      </View>

      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
      />
    </View>
  </View>
</ScrollView>

);
}

const styles = StyleSheet.create({
container: {
padding: 20,
paddingBottom: 40,
},
heading: {
fontSize: 26,
fontWeight: 'bold',
marginBottom: 20,
},
card: {
padding: 18,
borderRadius: 12,
marginBottom: 20,
elevation: 2,
},
label: {
fontSize: 15,
fontWeight: '600',
marginBottom: 8,
},
input: {
padding: 12,
borderRadius: 8,
marginBottom: 18,
fontSize: 16,
},
button: {
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
padding: 18,
borderRadius: 12,
elevation: 2,
},
themeRow: {
flexDirection: 'row',
alignItems: 'center',
},
themeTitle: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 5,
},
themeDescription: {
fontSize: 13,
},
});
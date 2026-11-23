import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { users } from '../data/users';

const ORANGE = '#F47721';
const DARK = '#25211E';
const MUTED = '#817970';
const CREAM = '#FFF8F0';

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const changeField = (field, value, setter) => {
    setter(value);
    setErrors(previous => ({ ...previous, [field]: '' }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validPassword = /^(?=.*\d).{8,}$/;

    if (mode === 'signup' && !name.trim()) newErrors.name = 'Full name is required';
    if (!validEmail.test(email.trim())) newErrors.email = 'Enter a valid email address';
    if (!validPassword.test(password)) newErrors.password = 'Use at least 8 characters and 1 digit';
    if (mode === 'signup' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'login') {
        const user = users.find(
          item =>
            item.email.toLowerCase() === email.trim().toLowerCase() &&
            item.password === password
        );
        setIsSubmitting(false);

        if (!user) {
          Alert.alert('Login Failed', 'Invalid email or password');
          return;
        }

        navigation.replace(user.role.toLowerCase() === 'manager' ? 'Dashboard' : 'Menu');
        return;
      }

      const exists = users.some(item => item.email.toLowerCase() === email.trim().toLowerCase());
      setIsSubmitting(false);

      if (exists) {
        Alert.alert('Signup Failed', 'Email already registered');
        return;
      }

      users.push({
        id: String(Date.now()),
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      Alert.alert('Account Created', 'Your account is ready. Please log in.', [
        {
          text: 'OK',
          onPress: () => {
            setMode('login');
            setPassword('');
            setConfirmPassword('');
            setErrors({});
          },
        },
      ]);
    }, 650);
  };

  const inputStyle = (field) => [
    styles.input,
    errors[field] ? styles.inputError : null,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍔</Text>
          </View>
          <Text style={styles.brand}>quick<Text style={styles.brandAccent}>bite</Text></Text>
          <Text style={styles.tagline}>GOOD FOOD. GOOD MOOD.</Text>
          <View style={styles.foodRow}>
            <Text style={styles.foodEmoji}>🍟</Text>
            <Text style={styles.foodEmoji}>🍕</Text>
            <Text style={styles.foodEmoji}>🥤</Text>
            <Text style={styles.foodEmoji}>🍔</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.eyebrow}>{mode === 'login' ? 'WELCOME BACK' : 'JOIN QUICK BITE'}</Text>
          <Text style={styles.heading}>{mode === 'login' ? 'Login to your account' : 'Create your account'}</Text>
          <Text style={styles.description}>
            {mode === 'login'
              ? 'Enter your details and enjoy your favourite food.'
              : 'Sign up to discover delicious food near you.'}
          </Text>

          {mode === 'signup' && (
            <>
              <Text style={styles.fieldLabel}>Full name</Text>
              <TextInput
                style={inputStyle('name')}
                placeholder="Enter your full name"
                placeholderTextColor="#A69D94"
                value={name}
                onChangeText={value => changeField('name', value, setName)}
                autoCapitalize="words"
              />
              {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </>
          )}

          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            style={inputStyle('email')}
            placeholder="you@example.com"
            placeholderTextColor="#A69D94"
            value={email}
            onChangeText={value => changeField('email', value, setEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={[styles.passwordWrap, errors.password ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor="#A69D94"
              value={password}
              onChangeText={value => changeField('password', value, setPassword)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(value => !value)} hitSlop={10}>
              <Text style={styles.showPassword}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
            </TouchableOpacity>
          </View>
          {!!errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {mode === 'signup' && (
            <>
              <Text style={styles.fieldLabel}>Confirm password</Text>
              <TextInput
                style={inputStyle('confirmPassword')}
                placeholder="Re-enter your password"
                placeholderTextColor="#A69D94"
                value={confirmPassword}
                onChangeText={value => changeField('confirmPassword', value, setConfirmPassword)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              {!!errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

              <Text style={styles.fieldLabel}>Account type</Text>
              <View style={styles.roleRow}>
                {['Customer', 'Manager'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.roleButton, role === item && styles.roleButtonActive]}
                    onPress={() => setRole(item)}
                  >
                    <Text style={[styles.roleText, role === item && styles.roleTextActive]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>{mode === 'login' ? 'LOGIN  →' : 'CREATE ACCOUNT  →'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already a member? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setErrors({});
              }}
            >
              <Text style={styles.switchAction}>{mode === 'login' ? 'Sign up' : 'Login'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>MADE WITH ♥ FOR FOOD LOVERS</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREAM },
  scrollContent: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 34, paddingBottom: 24 },
  hero: { alignItems: 'center', paddingBottom: 24 },
  logoCircle: {
    width: 76, height: 76, borderRadius: 25, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: ORANGE, shadowOpacity: 0.24, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  logoEmoji: { fontSize: 39 },
  brand: { color: DARK, fontSize: 34, fontWeight: '900', letterSpacing: -1.4, marginTop: 8 },
  brandAccent: { color: ORANGE },
  tagline: { color: MUTED, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginTop: 2 },
  foodRow: { flexDirection: 'row', gap: 17, marginTop: 15 },
  foodEmoji: { fontSize: 24 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 27, padding: 23,
    shadowColor: '#7D5A3B', shadowOpacity: 0.10, shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 }, elevation: 4,
  },
  eyebrow: { color: ORANGE, fontSize: 10, fontWeight: '900', letterSpacing: 2.2 },
  heading: { color: DARK, fontSize: 25, fontWeight: '900', marginTop: 7 },
  description: { color: MUTED, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 14 },
  fieldLabel: { color: DARK, fontSize: 12, fontWeight: '800', marginTop: 13, marginBottom: 7 },
  input: {
    minHeight: 51, borderWidth: 1, borderColor: '#EFE7DE', borderRadius: 13,
    paddingHorizontal: 15, color: DARK, backgroundColor: '#FFFCF8', fontSize: 14,
  },
  inputError: { borderColor: '#D94B42' },
  passwordWrap: {
    minHeight: 51, borderWidth: 1, borderColor: '#EFE7DE', borderRadius: 13,
    paddingLeft: 15, paddingRight: 14, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFCF8',
  },
  passwordInput: { flex: 1, color: DARK, fontSize: 14, paddingVertical: 12 },
  showPassword: { color: ORANGE, fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  error: { color: '#D94B42', fontSize: 11, marginTop: 5 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleButton: { flex: 1, borderWidth: 1, borderColor: '#EFE7DE', borderRadius: 12, padding: 12, alignItems: 'center' },
  roleButtonActive: { borderColor: ORANGE, backgroundColor: '#FFF1E5' },
  roleText: { color: MUTED, fontSize: 13, fontWeight: '700' },
  roleTextActive: { color: ORANGE },
  loginButton: {
    minHeight: 54, backgroundColor: ORANGE, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
    shadowColor: ORANGE, shadowOpacity: 0.25, shadowRadius: 9,
    shadowOffset: { width: 0, height: 5 }, elevation: 3,
  },
  buttonDisabled: { opacity: 0.65 },
  loginButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 19, flexWrap: 'wrap' },
  switchText: { color: MUTED, fontSize: 12 },
  switchAction: { color: ORANGE, fontSize: 12, fontWeight: '900' },
  footer: { color: '#B4A99E', fontSize: 9, fontWeight: '800', letterSpacing: 2, textAlign: 'center', marginTop: 20 },
});

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
} from 'react-native';
import { users } from '../data/users';

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
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validPassword = /^(?=.*\d).{8,}$/;

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!validEmail.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!validPassword.test(password)) {
      newErrors.password =
        'Password must have 8 characters and at least 1 digit';
    }

    if (
      mode === 'signup' &&
      password !== confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (mode === 'login') {
        const user = users.find(
          u =>
            u.email.toLowerCase() === email.trim().toLowerCase() &&
            u.password === password
        );

        setIsSubmitting(false);

        if (!user) {
          Alert.alert('Login Failed', 'Invalid email or password');
          return;
        }

        if (user.role.toLowerCase() === 'manager') {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('Menu');
        }
      } else {
        const exists = users.some(
          u => u.email.toLowerCase() === email.trim().toLowerCase()
        );

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

        Alert.alert(
          'Success',
          'Account created. Please log in.',
          [{
            text: 'OK',
            onPress: () => {
              setMode('login');
              setPassword('');
              setConfirmPassword('');
              setErrors({});
            },
          }]
        );
      }
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>
        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
      </Text>

      <Text style={styles.subtitle}>
        Restaurant App
      </Text>

      {mode === 'signup' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={v => changeField('name', v, setName)}
          />
          {!!errors.name && (
            <Text style={styles.error}>{errors.name}</Text>
          )}
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={v => changeField('email', v, setEmail)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!!errors.email && (
        <Text style={styles.error}>{errors.email}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={v => changeField('password', v, setPassword)}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />
      {!!errors.password && (
        <Text style={styles.error}>{errors.password}</Text>
      )}

      <TouchableOpacity
        onPress={() => setShowPassword(prev => !prev)}
      >
        <Text style={styles.showPassword}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </Text>
      </TouchableOpacity>

      {mode === 'signup' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={v =>
              changeField('confirmPassword', v, setConfirmPassword)
            }
            secureTextEntry={!showPassword}
          />
          {!!errors.confirmPassword && (
            <Text style={styles.error}>
              {errors.confirmPassword}
            </Text>
          )}

          <Text style={styles.label}>Select Role</Text>

          <View style={styles.roles}>
            {['Customer', 'Manager'].map(r => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleButton,
                  role === r && styles.selectedRole,
                ]}
                onPress={() => setRole(r)}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === r && styles.selectedRoleText,
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          isSubmitting && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          setErrors({});
        }}
      >
        <Text style={styles.switchText}>
          {mode === 'login'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#e67e22',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    fontSize: 16,
  },
  error: {
    color: '#c0392b',
    marginTop: 4,
  },
  showPassword: {
    color: '#e67e22',
    textAlign: 'right',
    marginTop: 8,
  },
  label: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roles: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e67e22',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#e67e22',
  },
  roleText: {
    color: '#333',
  },
  selectedRoleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e67e22',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#e67e22',
    textAlign: 'center',
    marginTop: 22,
    fontSize: 15,
  },
});
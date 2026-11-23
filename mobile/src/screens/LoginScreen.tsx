import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { CreateAccountScreen } from './CreateAccountScreen';
import { useState } from 'react';

  

export function LoginScreen(
  { onLogin, onCreateAccount }: {
    onLogin: () => void;
    onCreateAccount: () => void;
  }
) {  
    const [email, onChangeEmail] = useState('');
    const [senha, onChangeSenha] = useState('');

    return (

    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput 
      placeholder="Email" 
      style={styles.input}
      onChangeText={onChangeEmail}
      value={email}
      />
      <Text>Password:</Text>
      <TextInput 
      placeholder="Password" 
      style={styles.input}
      onChangeText={onChangeSenha}
      value={senha}
      secureTextEntry
      />
      <Button title="Login" onPress={onLogin} />
      <Button title="Create Account" onPress={onCreateAccount} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});

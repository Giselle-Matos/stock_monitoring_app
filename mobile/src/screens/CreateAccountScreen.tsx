import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';
import { useState } from 'react';


export function CreateAccountScreen(
  { onCreateAccount }: { onCreateAccount: () => void }
) {      
    const [email, onChangeEmailCadastro] = useState('');
    const [senha, onChangeSenhaCadastro] = useState('');
    const [idade, onChangeIdadeCadastro] = useState('');

    return (
    
    <View style={styles.container}>
      <Text>Create An Account</Text>
      <Text>Username:</Text>
      <TextInput 
        placeholder="Username" 
        style={styles.input}
        onChangeText={onChangeEmailCadastro}
        value={email}
      />
      <Text>Password:</Text>
      <TextInput 
        placeholder="Password" 
        style={styles.input}
        onChangeText={onChangeSenhaCadastro}
        value={senha}
        secureTextEntry
      />
      <Text>Idade:</Text>
      <TextInput 
        placeholder="Idade" 
        style={styles.input}
        onChangeText={onChangeIdadeCadastro }
        value={idade}
      />
      <Button title="Create Account and Login" onPress={onCreateAccount} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ee6e19',
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

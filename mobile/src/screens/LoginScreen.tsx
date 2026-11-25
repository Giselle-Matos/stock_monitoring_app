import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './services/firebase';
import { FirebaseError } from 'firebase/app';
  

export function LoginScreen(
  { onLogin, onCreateAccount }: {
    onLogin: () => void;
    onCreateAccount: () => void;
  }
) {  
    const [email, onChangeEmail] = useState('');
    const [senha, onChangeSenha] = useState('');
    const [mensagemErro, setMensagemErro] = useState('');

    async function login(){

        setMensagemErro('');

        if (!email.trim() || !senha){
            setMensagemErro('Preencha o email e a senha.');
            return;
        }

        try{
            await signInWithEmailAndPassword(auth, email.trim(), senha);
            onLogin();
        } catch (erro) { 
            let mensagem = 'Falha ao fazer login. Tente novamente';

            if (erro instanceof FirebaseError){
                switch (erro.code){
                    case 'auth/invalid-email':
                        mensagem = 'Digite um email valido.';
                        break;
                    case 'auth/invalid-credential':
                        mensagem = 'Credenciais inválidas.';
                        break;
                    case 'auth/user-not-found':
                        mensagem = 'Usuário não encontrado.';
                        break;  
                    case 'auth/wrong-password':
                        mensagem = 'Senha incorreta.'; 
                        break;
                    case 'auth/network-request-failed':
                        mensagem = 'Falha de rede. Verifique sua conexão.';
                        break;
                }
            }
            setMensagemErro(mensagem);
        }
    }

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
        {mensagemErro !== '' && (
        <View
            accessibilityRole="alert"
            style={{ backgroundColor: '#fde8e8', padding: 12, borderRadius: 6 }}
        >
            <Text style={{ color: '#8b1a1a' }}>{mensagemErro}</Text>
        </View>
        )}
      <Button title="Login" onPress={login} />
      <Button title="Create Account" onPress={onCreateAccount} />
        <Button title="Login with Google" onPress={() => {}} />
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

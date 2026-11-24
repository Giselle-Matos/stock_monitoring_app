import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './services/firebase';
import { FirebaseError } from 'firebase/app';


export function CreateAccountScreen(
  { onCreateAccount }: { onCreateAccount: () => void }
) {      
    const [email, onChangeEmailCadastro] = useState('');
    const [senha, onChangeSenhaCadastro] = useState('');
    const [idade, onChangeIdadeCadastro] = useState('');

    const [mensagemErro, setMensagemErro] = useState('');
    const [cadastrando, setCadastrando] = useState(false);

    async function cadastrar(){

        setMensagemErro('');

        const emailCadastrado = email.trim();

        if (!emailCadastrado || !senha){
            setMensagemErro('Preencha o email e a senha.');
            return;
        }

        setCadastrando(true);

        try{
            await createUserWithEmailAndPassword(auth, email, senha);
        } catch (erro) { 
            let mensagem = 'Falha ao criar a conta. Tente novamente';

            if (erro instanceof FirebaseError){
                switch (erro.code){
                    case 'auth/invalid-email':
                        mensagem = 'Digite um e-mail válido.';
                        break;
                    case 'auth/email-already-in-use':
                        mensagem = 'Já existe uma conta com esse e-mail. Faça login.';
                        break;
                    case 'auth/weak-password':
                    case 'auth/password-does-not-meet-requirements':
                        mensagem = 'A senha não atende aos requisitos. Tente uma senha mais forte.';
                        break;
                    case 'auth/network-request-failed':
                        mensagem = 'Verifique sua conexão e tente novamente.';
                        break;
                    case 'auth/too-many-requests':
                        mensagem = 'Muitas tentativas. Aguarde um pouco e tente novamente.';
                        break;
                    case 'auth/operation-not-allowed':
                        mensagem = 'O cadastro por e-mail está indisponível.';
                        break;
            }
        }

        setMensagemErro(mensagem);
        return;
    }
        finally{
            setCadastrando(false);
        }

        onCreateAccount();
}

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

        {mensagemErro !== '' && (
        <View
            accessibilityRole="alert"
            style={{ backgroundColor: '#fde8e8', padding: 12, borderRadius: 6 }}
        >
            <Text style={{ color: '#8b1a1a' }}>{mensagemErro}</Text>
        </View>
        )}

        <Button
        title={cadastrando ? 'Criando conta...' : 'Create Account and Login'}
        onPress={cadastrar}
        disabled={cadastrando}
        />

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

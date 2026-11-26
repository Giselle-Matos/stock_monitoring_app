import { StyleSheet, Text, View, Button, TextInput, Pressable, Image} from 'react-native';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './services/firebase';
import { FirebaseError } from 'firebase/app';
import { entrarComGoogle } from './services/googleLogin';
  

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
    async function loginComGoogle() {

        setMensagemErro('');

        try {
            if (await entrarComGoogle()) {
                onLogin();
            }


        } catch (erro) {
            if (erro instanceof FirebaseError) {
                if (erro.code === 'auth/popup-closed-by-user' ||
                    erro.code === 'auth/cancelled-popup-request') {
                    return;
                }
                if (erro.code === 'auth/unauthorized-domain') {
                    setMensagemErro('Autorize o domínio deste site no Firebase Authentication.');
                    return;
                }
                if (erro.code === 'auth/popup-blocked') {
                    setMensagemErro('Permita pop-ups neste site e tente novamente.');
                    return;
                }
            }

            const codigo = typeof erro === 'object' && erro !== null  && 'code' in erro
                ? ` (${String(erro.code)})`
                : '';

            setMensagemErro(`Falha ao entrar com Google${codigo}. Tente novamente.`);

        }
    }

    return (

    <View style={styles.container}>
        <View>
            <Text style={{fontSize: 24, fontWeight: 'bold', margin: 20}}>Welcome</Text>
        </View>
        <View style={{ gap: 12, alignItems: 'center' }}>
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
                    style={styles.errorBox}
                >
                    <Text style={styles.errorText}>{mensagemErro}</Text>
                </View>
                )}
        </View>
        <View style={{ gap: 12, marginTop: 12, alignItems: 'center' }}>
            <Pressable
                accessibilityRole="button"
                onPress={login}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.85 },
                ]}
                >
                <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>
            <Pressable
                accessibilityRole="button"
                onPress={onCreateAccount}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.85 },
                ]}
                >
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>
            <Pressable
                accessibilityRole="button"
                onPress={loginComGoogle}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.85 },
                ]}
                >
                <Text style={styles.buttonText}>Login with Google</Text>
            </Pressable>
            
        </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8EC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: 24,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,

    },
    errorBox:{ 
        backgroundColor: '#fde8e8', 
        padding: 12, 
        borderRadius: 6 
    },
    errorText: {
        color: '#8b1a1a' 
    },
    button: {
        minHeight: 48,
        borderRadius: 10,
        backgroundColor: '#F5AE18',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

});

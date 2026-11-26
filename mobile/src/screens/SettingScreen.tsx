import { StyleSheet, Text, View, Image, Button, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { deleteUser, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { FirebaseError } from 'firebase/app';


export function SettingScreen(
  { onLoginScreen, onHomeScreen}: { onLoginScreen: () => void, onHomeScreen: () => void }
) {      
    const [mensagemErro, setMensagemErro] = useState('');
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [precisaEntrarDeNovo, setPrecisaEntrarDeNovo] = useState(false);

    async function deleteAccount(){
      
        setMensagemErro('');
        setPrecisaEntrarDeNovo(false);
        const usuario = auth.currentUser;

        if(!usuario){
          setMensagemErro('Sua sessao terminou. Entre novamente');
          setPrecisaEntrarDeNovo(true);
          return;
        }

        try{
          await deleteUser(usuario);
          onLoginScreen();
        } 
        catch (erro) {
          if(
            erro instanceof FirebaseError &&
            erro.code === 'auth/requires-recent-login'
          ){
            setMensagemErro('Para deletar a conta, faça login novamente.');
            setPrecisaEntrarDeNovo(true);
            return;
          }

          setMensagemErro('Nao foi possivel excluir sua conta. Tente novamente');
        }}


    async function sairParaEntrarDeNovo() {
      try {
        await signOut(auth);
        onLoginScreen();
      } catch {
        setMensagemErro('Não foi possível sair da conta. Tente novamente.');
      }
    }
    return (
    
    <View style={styles.container}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>Settings</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setConfirmandoExclusao(true)}
        style={({ pressed }) => [
          styles.buttonDelete,
          pressed && { opacity: 0.85 },
        ]}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
      </Pressable>

      {mensagemErro !== '' && (
        <View accessibilityRole="alert" style={styles.errorBox}>
          <Text style={styles.errorText}>{mensagemErro}</Text>
        </View>
      )}
      {precisaEntrarDeNovo && (
        <Button title="Sair e entrar novamente" onPress={sairParaEntrarDeNovo} />
      )}

      {confirmandoExclusao && (
        <View>
            <Text style={{fontWeight: 'bold'}}>Tem certeza que deseja deletar sua conta?</Text>
            
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmandoExclusao(false)}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.85 },
              ]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
            
            <Pressable
              accessibilityRole="button"
              onPress={deleteAccount}
              style={({ pressed }) => [
                styles.buttonDelete,
                pressed && { opacity: 0.85 },
              ]}
              >
                <Text style={styles.buttonText}>Deletar</Text>
            </Pressable>
          </View>)
      }
      

      <Pressable
        accessibilityRole="button"
        onPress={() => onHomeScreen()}
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.85 },
        ]}
      >
          <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>

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
    errorBox: {
      backgroundColor: '#FDE8E8',
      padding: 12,
      borderRadius: 6,
    },
    errorText: {
      color: '#8B1A1A',
    },
    button: {
        minHeight: 48,
        borderRadius: 10,
        backgroundColor: '#F5AE18',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        margin: 10
    },
    buttonDelete: {
        minHeight: 48,
        borderRadius: 10,
        backgroundColor: '#8b1a1a',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        margin: 10
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

});

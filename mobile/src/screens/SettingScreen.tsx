import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TextInput } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { LoginScreen } from './LoginScreen';
import { useState } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth } from './services/firebase';
import { FirebaseError } from 'firebase/app';



export function SettingScreen(
  { onLoginScreen}: { onLoginScreen: () => void }
) {      
    const [mensagemErro, setMensagemErro] = useState('');
    const [cadastrando, setCadastrando] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

    async function deleteAccount(){
      
        setMensagemErro('');
        try{
          if (auth.currentUser === null) {
            setMensagemErro('Sessão encerrada.');
            return;
          }
          await deleteUser(auth.currentUser!);
          onLoginScreen();
          }
        catch (erro){
          let mensagem = 'Falha ao deletar a conta. Tente novamente';

          if (erro instanceof FirebaseError){ 
            mensagem = erro.message;
            switch (erro.code){
              case 'auth/requires-recent-login':
                mensagem = 'Para deletar a conta, faça login novamente.';
                break;
          }}
          setMensagemErro(mensagem);
        }
      }


    return (
    
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button
        title='Delete Account'
        onPress={() => setConfirmandoExclusao(true)}
      />
      {confirmandoExclusao && (
        <View>
            <Text>Tem certeza que deseja deletar sua conta?</Text>
            <Button
              title="Cancelar"
              onPress={() => setConfirmandoExclusao(false)}
            />
            <Button
              title="Deletar"
              onPress={deleteAccount}
            />
          </View>)
      }

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
    padding: 10
  }
});


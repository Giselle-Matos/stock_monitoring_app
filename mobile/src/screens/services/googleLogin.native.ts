import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';


GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function entrarComGoogle(): Promise<boolean> {
  await GoogleSignin.hasPlayServices();

  if (GoogleSignin.hasPreviousSignIn()) {
    await GoogleSignin.signOut();
  }

  const resposta = await GoogleSignin.signIn();

  if (!isSuccessResponse(resposta)) {
    return false;
  }
  const { idToken} = resposta.data;

  if (!idToken) {
    throw new Error('O Google não retornou o token. Confira o ID do cliente Web.');
  }

  await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  return true;

}


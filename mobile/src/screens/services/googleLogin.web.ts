import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

export async function entrarComGoogle(): Promise<boolean> {
  await signInWithPopup(auth, new GoogleAuthProvider());
  return true;
}

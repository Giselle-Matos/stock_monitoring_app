import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SplashScreen } from './src/screens/SplashScreen';
import { useEffect, useState} from 'react';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CreateAccountScreen } from './src/screens/CreateAccountScreen';
import {SettingScreen} from './src/screens/SettingScreen';

type Screen = 'Splash' | 'Login' | 'Home' | 'CreateAccount' | 'Setting';

export default function App() {

  const [screen, setScreen] = useState<Screen>('Splash');
  useEffect (() => {  setTimeout(() => { setScreen('Login'); }, 3000); 
        }, 
      []);
  switch (screen) { 
    case 'Splash':
      return <SplashScreen />;
    case 'Login':
      return  (<LoginScreen
          onLogin={() => setScreen('Home')}
          onCreateAccount={() => 
            setScreen('CreateAccount')}
        />);
    case 'Home':
      return <HomeScreen 
      onLogout={() => setScreen('Login')} 
      onSettingScreen={() => setScreen('Setting')} />;    
    case 'CreateAccount':
      return <CreateAccountScreen 
      onCreateAccount={() => setScreen('Login')} 
      />;    
    case 'Setting':
      return <SettingScreen 
      onLoginScreen={() => setScreen('Login')} 
      />;
      default:
      return null;
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});

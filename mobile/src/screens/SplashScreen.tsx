import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

  

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('../../assets/bull_splash_screen.png')}      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFBD59',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 200,
    height: 200,
    resizeMode:"contain"
  },
});

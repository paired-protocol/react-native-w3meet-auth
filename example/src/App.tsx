import { View, StyleSheet, Button } from 'react-native';
import { Authenticator } from 'react-native-w3meet-auth';

const authenticator = Authenticator.config({
  host: 'http://127.0.0.1:4943',
  canisterId: 'bw4dl-smaaa-aaaaa-qaacq-cai',
  passkey: {
    user: {
      id: '1',
      name: 'Passkey Test',
      displayName: 'Passkey Test',
    },
    rp: {
      name: 'Passkey Test',
      id: 'vercel-endpoint.vercel.app',
    },
  },
});

export default function App() {
  const onPress = async () => {
    const result = await authenticator.signIn();

    console.log(result);
  };

  return (
    <View style={styles.container}>
      <Button title="SignIn" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

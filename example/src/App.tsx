import { View, StyleSheet, Button } from 'react-native';
import { Authenticator } from 'react-native-w3meet-auth';

const authenticator = Authenticator.config({
  canisterId: 'your-canister-id',
});

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="SignIn" onPress={() => authenticator.signIn()} />
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

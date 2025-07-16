import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useForm } from './hooks/form';
import { Button } from '../../components/button';
import isEmpty from 'lodash/isEmpty';

export function Login() {
  const form = useForm();

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Get Started</Text>

        <Text style={styles.subtitle}>
          Create or select an identity and authenticate with your Passkey.
        </Text>

        {!isEmpty(form.users) && (
          <View style={styles.users}>
            {form.users.map((id) => (
              <TouchableOpacity key={id} onPress={() => form.authenticate(id)}>
                <View style={styles.row}>
                  <Text style={styles.user}>{id}</Text>
                  <Text style={styles.user}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Button
          title="Continue with passkey"
          onPress={form.create}
          loading={{
            status: form.loading,
            message: 'Processing...',
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  form: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    paddingTop: 30,
    paddingBottom: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#090909',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#CCCCCC',
  },
  light: {
    color: '#000000',
  },
  principal: {
    fontSize: 16,
    fontWeight: 400,
    borderRadius: 8,
    color: '#555',
  },
  amount: {
    fontSize: 60,
    marginBottom: 20,
    padding: 14,
    alignSelf: 'center',
    fontWeight: 'bold',
    borderRadius: 8,
    color: '#555',
  },
  users: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#222222',
    borderTopWidth: 1,
  },
  user: {
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

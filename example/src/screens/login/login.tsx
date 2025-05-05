import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useForm } from './hooks/form';
import { Button } from '../../components/button';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export function Login() {
  const form = useForm();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your Identity</Text>

      <Text style={styles.subtitle}>
        Create or select an identity and authenticate with your Passkey.
      </Text>

      <View style={styles.users}>
        {form.users.map((user) => (
          <TouchableOpacity key={user} onPress={() => form.select(user)}>
            <View style={styles.row}>
              <Text style={styles.user}>{user}</Text>
              <Text style={styles.user}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Create new"
        onPress={form.create}
        loading={{
          status: form.loading,
          message: 'Processing...',
        }}
      />

      <BottomSheet
        ref={form.bottomSheetRef}
        snapPoints={[400]}
        index={-1}
        enableHandlePanningGesture
        enableOverDrag
        enablePanDownToClose
      >
        <BottomSheetView style={styles.drawer}>
          {form.selected.id && (
            <>
              <Text style={[styles.title, styles.light]}>
                {form.selected.id}
              </Text>

              <Text style={styles.principal}>{form.selected.principal}</Text>
              <Text style={styles.amount}>23</Text>
            </>
          )}

          <Button
            title="Add"
            onPress={form.create}
            loading={{
              status: form.loading,
              message: 'Adding...',
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  light: {
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#CCCCCC',
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
    marginBottom: 40,
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
  drawer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
});

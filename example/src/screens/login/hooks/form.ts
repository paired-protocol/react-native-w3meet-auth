import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { Connection } from 'react-native-w3meet-auth';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

import { useMainContext } from '../../../contexts/main';
import { StringHelper } from '../../../helpers/string';

const connection = Connection.create({
  host: 'http://127.0.0.1:4943',
  canisterId: 'avqkn-guaaa-aaaaa-qaaea-cai',
});

const authConnector = new CanisterAuthConnector({
  canister: {
    id: 'avqkn-guaaa-aaaaa-qaaea-cai',
    host: 'http://127.0.0.1:4943',
  },
});

authConnector.invoke({
  passkey: {
    user: {
      id: 'test-user',
      name: 'Test User',
      displayName: 'Test User',
    },
    rp: {
      name: 'Passkey Test',
      id: 'vercel-endpoint.vercel.app',
    },
  },
});

const token = authConnector.attachCanister({
  useAuthentication: true,
  id: 'dvqkn-guaaa-aaaaa-qaaea-cai',
  host: 'http://127.0.0.1:4944',
  abi: [],
});

token.call('greet');

const storage = new MMKVLoader().initialize();

export function useForm() {
  const [loading, setLoading] = useState(false);

  const { setIteratorCanisterProvider } = useMainContext();
  const [users, setUsers] = useMMKVStorage<string[]>('users', storage, []);

  const authenticate = useCallback(
    async (id: string) => {
      setLoading(true);

      try {
        if (!id) {
          Alert.alert('Error', 'Please select a user.');
          return;
        }

        const iterator = connection.config({
          passkey: {
            user: {
              id,
              name: id,
              displayName: id,
            },
            rp: {
              name: 'Passkey Test',
              id: 'vercel-endpoint.vercel.app',
            },
          },
          abi: [],
        });

        const authetication = await iterator.authenticate();
        const principal = authetication.identity.getPrincipal();

        console.log('Principal:', principal.toString());

        if (principal) {
          setIteratorCanisterProvider(iterator);
        }

        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message);
        } else {
          Alert.alert('An unknown error occurred');
        }

        setLoading(false);
      }
    },
    [setIteratorCanisterProvider]
  );

  const create = useCallback(async () => {
    setLoading(true);
    try {
      const id = StringHelper.generateRandomChars(8);

      const iterator = connection.config({
        passkey: {
          user: {
            id,
            name: id,
            displayName: id,
          },
          rp: {
            name: id,
            id: 'vercel-endpoint.vercel.app',
          },
        },
        abi: [],
      });

      const authetication = await iterator.authenticate();
      const principal = authetication.identity.getPrincipal();

      if (principal) {
        setIteratorCanisterProvider(iterator);

        if (!users.includes(id)) {
          setUsers((previous) => [...previous, id!]);
        }
      }

      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert('An unknown error occurred');
      }
      setLoading(false);
    }
  }, [setIteratorCanisterProvider, setUsers, users]);

  return {
    loading,
    create,
    users,
    authenticate,
  };
}

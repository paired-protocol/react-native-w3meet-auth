import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { Connection } from 'react-native-w3meet-auth';
import BottomSheet from '@gorhom/bottom-sheet';

import { StringHelper } from '../../../helpers/string';

import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';

const connection = Connection.create({
  host: 'http://127.0.0.1:4943',
  canisterId: 'bw4dl-smaaa-aaaaa-qaacq-cai',
});

const storage = new MMKVLoader().initialize();

const abi = [
  {
    name: 'getValue',
    type: 'function',
    inputs: [],
    outputs: ['text'],
  },
];

export function useForm() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useMMKVStorage<string[]>('users', storage, []);

  const [selected, setSelected] = useState({
    id: '',
    principal: '',
  });

  const authenticate = useCallback(
    async (id?: string) => {
      setLoading(true);

      try {
        if (!id) {
          id = StringHelper.generateRandomChars(8);
        }

        if (!id) {
          Alert.alert('Error', 'Please select a user.');
          return;
        }

        const iterator = connection.config({
          passkey: {
            user: {
              id,
              name: 'Nadson Fernando',
              displayName: 'Nadson Fernando',
            },
            rp: {
              name: 'Passkey Test',
              id: 'vercel-endpoint.vercel.app',
            },
          },
          abi,
        });

        const identity = await iterator.authenticate();
        const principal = identity.getPrincipal().toString();

        if (principal && !users.includes(id)) {
          setUsers((previous) => [...previous, id!]);
        }

        setSelected({ id, principal });
        bottomSheetRef.current?.snapToIndex(0);

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
    [setUsers, users, bottomSheetRef]
  );

  const create = useCallback(async () => {
    authenticate();
  }, [authenticate]);

  const select = useCallback(
    async (id: string) => {
      authenticate(id);
    },
    [authenticate]
  );

  return { loading, create, select, users, selected, bottomSheetRef };
}

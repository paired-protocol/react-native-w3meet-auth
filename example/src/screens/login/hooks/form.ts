import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { Connection } from 'react-native-w3meet-auth';

import BottomSheet from '@gorhom/bottom-sheet';

import { StringHelper } from '../../../helpers/string';
import type { IteratorProvider } from '../../../../../src/common/provider/iterator';

const connection = Connection.create({
  host: 'http://127.0.0.1:4943',
  canisterId: 'bw4dl-smaaa-aaaaa-qaacq-cai',
});

const storage = new MMKVLoader().initialize();

const abi = [
  {
    name: 'addUserValue',
    type: 'function',
    inputs: [],
    outputs: [
      {
        principal: 'text',
        value: 'int',
      },
    ],
  },
  {
    name: 'getUserValue',
    type: 'function',
    inputs: [],
    outputs: [
      {
        principal: 'text',
        value: 'int',
      },
    ],
  },
];

export function useForm() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [iterator, setIterator] = useState<IteratorProvider | null>(null);

  const [selected, setSelected] = useState({
    id: '',
    principal: '',
  });

  const [users, setUsers] = useMMKVStorage<string[]>('users', storage, []);

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

        const iteratorConfig = connection.config({
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

        const authetication = await iteratorConfig.authenticate();
        const principal = authetication.identity.getPrincipal().toString();

        const response = await authetication?.actor?.getUserValue();

        if (response) {
          setValue(response.value);
        }

        setIterator(iteratorConfig);

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

  const add = useCallback(async () => {
    try {
      const response = await iterator?.call('addUserValue', {});

      setValue(response.value);
    } catch (error) {
      console.log({ error });
    }
  }, [iterator]);

  const select = useCallback(
    async (id: string) => {
      authenticate(id);
    },
    [authenticate]
  );

  return {
    loading,
    create,
    add,
    select,
    users,
    selected,
    bottomSheetRef,
    value,
  };
}

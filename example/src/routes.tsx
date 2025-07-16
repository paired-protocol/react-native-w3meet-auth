import { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login } from './screens/login';
import { Home } from './screens/home';

const Stack = createNativeStackNavigator();

export function Routes() {
  const initialRouteName = useMemo(() => {
    return 'Login';
  }, []);

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

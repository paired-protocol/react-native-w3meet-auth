import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

interface ButtonProps {
  title: string;
  loading?: {
    status: boolean;
    message?: string;
  };
  style?: any;
  onPress: () => void;
}

export function Button({ title, loading, style, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <Text style={styles.text}>
        {loading?.status ? loading.message : title}
      </Text>

      {loading?.status && (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="small"
          color="#000000"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
  },
  text: {
    fontSize: 18,
    color: '#000000',
  },
  activityIndicator: {
    position: 'absolute',
    right: 20,
  },
});

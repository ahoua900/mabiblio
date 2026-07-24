import AsyncStorage from '@react-native-async-storage/async-storage';

const P = 'lectura.';

export const storage = {
  async get(key, def) {
    try {
      const v = await AsyncStorage.getItem(P + key);
      return v != null ? JSON.parse(v) : def;
    } catch (e) {
      return def;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(P + key, JSON.stringify(value));
    } catch (e) {}
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(P + key);
    } catch (e) {}
  },
};

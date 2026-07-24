import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Stars({ rating, size = 14, gap = 1 }) {
  const r = Math.round(rating || 0);
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name="star"
          size={size}
          color={i <= r ? '#F5A623' : '#DBDBE2'}
          style={{ marginRight: gap }}
        />
      ))}
    </View>
  );
}

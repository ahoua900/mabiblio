import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { serif } from '../theme';
import { PressableScale } from './anim';

export default function Cover({ book, width, height, onPress, radius = 13 }) {
  const [imgFailed, setImgFailed] = useState(false);
  const boxStyle = [styles.cover, { width, height, borderRadius: radius, backgroundColor: book.color }];
  const showImage = book.thumbnail && !imgFailed;

  const inner = showImage ? (
    <Image
      source={{ uri: book.thumbnail }}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
      onError={() => setImgFailed(true)}
    />
  ) : (
    <>
      <View style={styles.tag}>
        <Text style={styles.tagText}>PDF</Text>
      </View>
      <View>
        <Text style={styles.title} numberOfLines={3}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={boxStyle}>
        {inner}
      </PressableScale>
    );
  }
  return <View style={boxStyle}>{inner}</View>;
}

const styles = StyleSheet.create({
  cover: {
    padding: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    shadowColor: '#141420',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  tag: {
    position: 'absolute',
    top: 9,
    left: 9,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: { color: '#fff', fontSize: 9.5, fontWeight: '800', letterSpacing: 0.5 },
  title: { color: '#fff', fontWeight: '800', fontSize: 14, lineHeight: 17, fontFamily: serif },
  author: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginTop: 3 },
});

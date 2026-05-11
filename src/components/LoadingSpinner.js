import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';

export default function LoadingSpinner({message = 'Loading...'}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#757575',
  },
});

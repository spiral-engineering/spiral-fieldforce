import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {submitReport, resetSubmitSuccess, clearError} from '../store/reportSlice';
import {launchImageLibrary} from 'react-native-image-picker';

export default function ReportScreen() {
  const dispatch = useDispatch();
  const {isSubmitting, error, submitSuccess} = useSelector(
    state => state.report,
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    if (submitSuccess) {
      Alert.alert('Success', 'Report submitted successfully!', [
        {text: 'OK', onPress: () => dispatch(resetSubmitSuccess())},
      ]);
      setTitle('');
      setDescription('');
      setPhotoUri(null);
    }
  }, [submitSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {text: 'OK', onPress: () => dispatch(clearError())},
      ]);
    }
  }, [error, dispatch]);

  const handleSelectPhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Failed to pick image.');
          return;
        }
        const asset = response.assets?.[0];
        if (asset?.uri) {
          setPhotoUri(asset.uri);
        }
      },
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a report title.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation', 'Please enter a report description.');
      return;
    }
    dispatch(submitReport({title: title.trim(), description: description.trim(), photoUri}));
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Report</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Report Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Customer visit at ABC Corp"
          value={title}
          onChangeText={setTitle}
          returnKeyType="next"
          maxLength={100}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe your daily activities, findings, and outcomes..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={1000}
        />
        <Text style={styles.charCount}>{description.length}/1000</Text>

        <Text style={styles.label}>Photo (Optional)</Text>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={handleSelectPhoto}>
          <Text style={styles.photoButtonText}>
            {photoUri ? '📷 Change Photo' : '📷 Attach Photo'}
          </Text>
        </TouchableOpacity>

        {photoUri && (
          <View style={styles.photoPreview}>
            <Image source={{uri: photoUri}} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() => setPhotoUri(null)}>
              <Text style={styles.removePhotoText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#1565C0',
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#BBDEFB',
    marginTop: 4,
  },
  form: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#212121',
    backgroundColor: '#fafafa',
  },
  textarea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 4,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  photoButtonText: {
    color: '#2196F3',
    fontSize: 15,
    fontWeight: '600',
  },
  photoPreview: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  removePhoto: {
    backgroundColor: '#F44336',
    padding: 8,
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitDisabled: {
    backgroundColor: '#90CAF9',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

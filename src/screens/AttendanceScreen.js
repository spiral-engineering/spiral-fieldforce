import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {checkIn, checkOut} from '../store/attendanceSlice';

function formatDateTime(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

export default function AttendanceScreen() {
  const dispatch = useDispatch();
  const {todayRecord, isLoading, error} = useSelector(
    state => state.attendance,
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const hasCheckedIn = Boolean(todayRecord?.checkIn);
  const hasCheckedOut = Boolean(todayRecord?.checkOut);

  const handleCheckIn = () => {
    Alert.alert('Check In', 'Confirm check-in at the current time?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Confirm', onPress: () => dispatch(checkIn())},
    ]);
  };

  const handleCheckOut = () => {
    Alert.alert('Check Out', 'Confirm check-out at the current time?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Confirm', onPress: () => dispatch(checkOut())},
    ]);
  };

  const checkInInfo = formatDateTime(todayRecord?.checkIn);
  const checkOutInfo = formatDateTime(todayRecord?.checkOut);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerDate}>{currentTime.toDateString()}</Text>
      </View>

      {/* Live Clock */}
      <View style={styles.clockCard}>
        <Text style={styles.clockTime}>
          {currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Text>
        <Text style={styles.clockLabel}>Current Time</Text>
      </View>

      {/* Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Today's Status</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {hasCheckedOut
              ? '✅ Completed'
              : hasCheckedIn
              ? '🟡 Checked In'
              : '⭕ Not Started'}
          </Text>
        </View>
      </View>

      {/* Check-in Record */}
      {checkInInfo && (
        <View style={styles.recordCard}>
          <Text style={styles.recordLabel}>Check-In Time</Text>
          <Text style={styles.recordTime}>{checkInInfo.time}</Text>
          <Text style={styles.recordDate}>{checkInInfo.date}</Text>
        </View>
      )}

      {/* Check-out Record */}
      {checkOutInfo && (
        <View style={[styles.recordCard, styles.recordCardOut]}>
          <Text style={styles.recordLabel}>Check-Out Time</Text>
          <Text style={styles.recordTime}>{checkOutInfo.time}</Text>
          <Text style={styles.recordDate}>{checkOutInfo.date}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.checkInButton,
            (hasCheckedIn || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleCheckIn}
          disabled={hasCheckedIn || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonIcon}>🟢</Text>
              <Text style={styles.buttonText}>Check In</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.checkOutButton,
            (!hasCheckedIn || hasCheckedOut || isLoading) &&
              styles.buttonDisabled,
          ]}
          onPress={handleCheckOut}
          disabled={!hasCheckedIn || hasCheckedOut || isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonIcon}>🔴</Text>
              <Text style={styles.buttonText}>Check Out</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        * Attendance is recorded with the current device timestamp.
      </Text>
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
  headerDate: {
    fontSize: 14,
    color: '#BBDEFB',
    marginTop: 4,
  },
  clockCard: {
    backgroundColor: '#1976D2',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  clockTime: {
    fontSize: 42,
    fontWeight: '300',
    color: '#fff',
    letterSpacing: 2,
  },
  clockLabel: {
    color: '#BBDEFB',
    fontSize: 13,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },
  statusBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 13,
    color: '#1565C0',
    fontWeight: '600',
  },
  recordCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  recordCardOut: {
    backgroundColor: '#FFF3E0',
    borderLeftColor: '#FF9800',
  },
  recordLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  recordTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },
  recordDate: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
  },
  checkOutButton: {
    backgroundColor: '#F44336',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: 12,
    margin: 16,
    marginTop: 8,
  },
});

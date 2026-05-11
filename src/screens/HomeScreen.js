import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAttendanceHistory} from '../store/attendanceSlice';
import {fetchReports} from '../store/reportSlice';

function formatDate(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
}

export default function HomeScreen({navigation}) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const {todayRecord, history, isLoading: attendanceLoading} = useSelector(
    state => state.attendance,
  );
  const {reports, isLoading: reportLoading} = useSelector(
    state => state.report,
  );

  const isRefreshing = attendanceLoading || reportLoading;

  const loadData = React.useCallback(() => {
    dispatch(fetchAttendanceHistory());
    dispatch(fetchReports());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const checkedIn = todayRecord?.checkIn;
  const checkedOut = todayRecord?.checkOut;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={loadData} />
      }>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.name || user?.username || 'Employee'} 👋
        </Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      {/* Today's Attendance Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Attendance</Text>
        <View style={styles.attendanceRow}>
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceLabel}>Check-In</Text>
            <Text
              style={[
                styles.attendanceValue,
                checkedIn ? styles.checkedIn : styles.notChecked,
              ]}>
              {checkedIn ? formatTime(checkedIn) : 'Not yet'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceLabel}>Check-Out</Text>
            <Text
              style={[
                styles.attendanceValue,
                checkedOut ? styles.checkedOut : styles.notChecked,
              ]}>
              {checkedOut ? formatTime(checkedOut) : 'Not yet'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.attendanceButton}
          onPress={() => navigation.navigate('Attendance')}>
          <Text style={styles.attendanceButtonText}>Manage Attendance →</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Reports */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Report')}>
            <Text style={styles.seeAll}>+ New Report</Text>
          </TouchableOpacity>
        </View>
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reports submitted yet.</Text>
          </View>
        ) : (
          reports.slice(0, 5).map((report, index) => (
            <View key={report.id || index} style={styles.reportItem}>
              <View style={styles.reportLeft}>
                <Text style={styles.reportTitle} numberOfLines={1}>
                  {report.title}
                </Text>
                <Text style={styles.reportDesc} numberOfLines={2}>
                  {report.description}
                </Text>
              </View>
              <Text style={styles.reportDate}>
                {formatDate(report.createdAt)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Attendance History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance History</Text>
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No attendance records found.</Text>
          </View>
        ) : (
          history.slice(0, 5).map((record, index) => (
            <View key={record.id || index} style={styles.historyItem}>
              <Text style={styles.historyDate}>
                {formatDate(record.checkIn || record.date)}
              </Text>
              <View style={styles.historyTimes}>
                <Text style={styles.historyTime}>
                  In: {formatTime(record.checkIn)}
                </Text>
                <Text style={styles.historyTime}>
                  Out: {record.checkOut ? formatTime(record.checkOut) : '—'}
                </Text>
              </View>
            </View>
          ))
        )}
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
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#BBDEFB',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  attendanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  attendanceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  checkedIn: {color: '#4CAF50'},
  checkedOut: {color: '#FF9800'},
  notChecked: {color: '#BDBDBD'},
  attendanceButton: {
    alignItems: 'flex-end',
  },
  attendanceButtonText: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  seeAll: {
    color: '#2196F3',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  reportItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  reportLeft: {
    flex: 1,
    marginRight: 8,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  reportDesc: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  reportDate: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  historyTimes: {
    alignItems: 'flex-end',
  },
  historyTime: {
    fontSize: 12,
    color: '#757575',
  },
});

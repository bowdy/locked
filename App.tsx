import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LOCKED_IN_THRESHOLD } from './src/data/checklist';
import { addDays, dateKey } from './src/lib/dates';
import { DayRecord, loadHistory } from './src/lib/storage';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { TodayScreen } from './src/screens/TodayScreen';
import { colors } from './src/theme';

type Tab = 'today' | 'history';

/** Consecutive locked-in days ending today (or yesterday, if today isn't scored yet). */
function computeStreak(history: DayRecord[]): number {
  const locked = new Set(
    history.filter((r) => r.score >= LOCKED_IN_THRESHOLD).map((r) => r.key)
  );
  let cursor = dateKey();
  if (!locked.has(cursor)) cursor = addDays(cursor, -1);
  let streak = 0;
  while (locked.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function Root() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('today');
  const [history, setHistory] = useState<DayRecord[]>([]);

  const refreshHistory = useCallback(() => {
    loadHistory().then(setHistory);
  }, []);

  useEffect(refreshHistory, [refreshHistory]);

  const streak = useMemo(() => computeStreak(history), [history]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {tab === 'today' ? (
          <TodayScreen streak={streak} onDayChanged={refreshHistory} />
        ) : (
          <HistoryScreen history={history} streak={streak} />
        )}
      </View>
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <TabButton label="Today" icon="☑️" active={tab === 'today'} onPress={() => setTab('today')} />
        <TabButton
          label="History"
          icon="📈"
          active={tab === 'history'}
          onPress={() => {
            refreshHistory();
            setTab('history');
          }}
        />
      </View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.tabButton} onPress={onPress} accessibilityRole="tab">
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Root />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    color: colors.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: colors.accent,
  },
});

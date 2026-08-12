import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALL_ITEM_COUNT, LOCKED_IN_THRESHOLD, SCORE_MAX } from '../data/checklist';
import { formatKey, isToday } from '../lib/dates';
import { DayRecord } from '../lib/storage';
import { colors, radii } from '../theme';

interface Props {
  history: DayRecord[];
  streak: number;
}

export function HistoryScreen({ history, streak }: Props) {
  const insets = useSafeAreaInsets();
  const lockedDays = history.filter((r) => r.score >= LOCKED_IN_THRESHOLD).length;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>History</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>🔥 {streak}</Text>
          <Text style={styles.statLabel}>day streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{lockedDays}</Text>
          <Text style={styles.statLabel}>locked-in days</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{history.length}</Text>
          <Text style={styles.statLabel}>days tracked</Text>
        </View>
      </View>
      <Text style={styles.hint}>
        A day is locked in at a score of {LOCKED_IN_THRESHOLD}/{SCORE_MAX} or better.
      </Text>
      <FlatList
        data={history}
        keyExtractor={(r) => r.key}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No days tracked yet. Start ticking boxes on Today.</Text>
        }
        renderItem={({ item }) => {
          const lockedIn = item.score >= LOCKED_IN_THRESHOLD;
          return (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowDate}>
                  {formatKey(item.key)}
                  {isToday(item.key) ? '  ·  today' : ''}
                </Text>
                <Text style={styles.rowDetail}>
                  {item.checkedCount} of {ALL_ITEM_COUNT} items checked
                </Text>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${(item.score / SCORE_MAX) * 100}%`,
                        backgroundColor: lockedIn ? colors.accent : colors.gold,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={[styles.rowScore, lockedIn && styles.rowScoreLocked]}>
                {item.score}/{SCORE_MAX}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 3,
  },
  hint: {
    color: colors.textDim,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  empty: {
    color: colors.textDim,
    textAlign: 'center',
    paddingTop: 40,
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDate: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rowDetail: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  rowScore: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  rowScoreLocked: {
    color: colors.accent,
  },
});

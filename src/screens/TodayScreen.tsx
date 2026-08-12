import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScoreCard } from '../components/ScoreCard';
import { SectionCard } from '../components/SectionCard';
import { SECTIONS } from '../data/checklist';
import { dateKey } from '../lib/dates';
import { DayState, loadDay, saveDay } from '../lib/storage';
import { colors } from '../theme';

interface Props {
  streak: number;
  onDayChanged: () => void;
}

export function TodayScreen({ streak, onDayChanged }: Props) {
  const insets = useSafeAreaInsets();
  const [day, setDay] = useState(dateKey());
  const [state, setState] = useState<DayState>({});
  const [loaded, setLoaded] = useState(false);
  const dayRef = useRef(day);
  dayRef.current = day;

  useEffect(() => {
    let cancelled = false;
    loadDay(day).then((s) => {
      if (!cancelled) {
        setState(s);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [day]);

  // Roll over to a fresh checklist when the app comes back on a new day.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active' && dateKey() !== dayRef.current) {
        setLoaded(false);
        setDay(dateKey());
        onDayChanged();
      }
    });
    return () => sub.remove();
  }, [onDayChanged]);

  const toggle = useCallback(
    (itemId: string) => {
      setState((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };
        saveDay(dayRef.current, next).then(onDayChanged);
        return next;
      });
    },
    [onDayChanged]
  );

  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 24 }}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appTitle}>Locked In</Text>
          <Text style={styles.date}>{dateLabel}</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>🔥 {streak}</Text>
        </View>
      </View>
      {loaded && (
        <>
          {SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} state={state} onToggle={toggle} />
          ))}
          <ScoreCard state={state} onToggle={toggle} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  appTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  date: {
    color: colors.textDim,
    fontSize: 15,
    marginTop: 2,
  },
  streakPill: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  streakText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

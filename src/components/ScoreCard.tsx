import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SCORE_MAX, SCORE_SECTION } from '../data/checklist';
import { DayState, scoreOf } from '../lib/storage';
import { colors, radii } from '../theme';
import { CheckRow } from './CheckRow';

interface Props {
  state: DayState;
  onToggle: (itemId: string) => void;
}

function ScoreCardInner({ state, onToggle }: Props) {
  const score = scoreOf(state);
  const perfect = score === SCORE_MAX;

  return (
    <View style={[styles.card, perfect && styles.cardPerfect]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {SCORE_SECTION.emoji}  {SCORE_SECTION.title}
        </Text>
        <Text style={[styles.score, perfect && styles.scorePerfect]}>
          {score} / {SCORE_MAX}
        </Text>
      </View>
      <View style={styles.dots}>
        {SCORE_SECTION.items.map((item) => (
          <View key={item.id} style={[styles.dot, state[item.id] && styles.dotOn]} />
        ))}
      </View>
      {SCORE_SECTION.items.map((item) => (
        <CheckRow
          key={item.id}
          label={item.label}
          checked={!!state[item.id]}
          onToggle={() => onToggle(item.id)}
        />
      ))}
      {perfect && <Text style={styles.lockedIn}>LOCKED IN 🔒</Text>}
    </View>
  );
}

export const ScoreCard = React.memo(ScoreCardInner);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.gold,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingBottom: 6,
    overflow: 'hidden',
  },
  cardPerfect: {
    borderColor: colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  score: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  scorePerfect: {
    color: colors.accent,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotOn: {
    backgroundColor: colors.gold,
  },
  lockedIn: {
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 2,
    paddingVertical: 12,
  },
});

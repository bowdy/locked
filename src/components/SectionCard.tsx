import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Section } from '../data/checklist';
import { DayState } from '../lib/storage';
import { colors, radii } from '../theme';
import { CheckRow } from './CheckRow';

interface Props {
  section: Section;
  state: DayState;
  onToggle: (itemId: string) => void;
}

function SectionCardInner({ section, state, onToggle }: Props) {
  const done = section.items.filter((i) => state[i.id]).length;
  const total = section.items.length;
  const complete = done === total;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {section.emoji}  {section.title}
        </Text>
        <Text style={[styles.count, complete && styles.countDone]}>
          {done}/{total}
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(done / total) * 100}%` }]} />
      </View>
      {section.items.map((item) => (
        <CheckRow
          key={item.id}
          label={item.label}
          checked={!!state[item.id]}
          onToggle={() => onToggle(item.id)}
        />
      ))}
    </View>
  );
}

export const SectionCard = React.memo(SectionCardInner);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingBottom: 6,
    overflow: 'hidden',
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
  count: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  countDone: {
    color: colors.accent,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginHorizontal: 14,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
});

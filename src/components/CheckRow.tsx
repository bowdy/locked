import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function CheckRowInner({ label, checked, onToggle }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={4}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </Pressable>
  );
}

export const CheckRow = React.memo(CheckRowInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowPressed: {
    backgroundColor: colors.cardPressed,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tick: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  labelChecked: {
    color: colors.textDim,
    textDecorationLine: 'line-through',
  },
});

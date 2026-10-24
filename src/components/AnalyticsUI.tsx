'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DATE_PRESETS,
  type DatePreset,
  type RangePreset,
  formatDayLabel,
} from '@/lib/analytics-client';
import styles from './AnalyticsUI.module.css';

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>{label}</span>
      <span className={styles.cardValue}>{value}</span>
      {hint && <span className={styles.cardHint}>{hint}</span>}
    </div>
  );
}

export function ViewsChart({
  data,
  height = 240,
}: {
  data: { day: string; views: number }[];
  height?: number;
}) {
  return (
    <div className={styles.chartCard}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="#eef1ee" />
          <XAxis
            dataKey="day"
            tickFormatter={formatDayLabel}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            interval="preserveStartEnd"
            minTickGap={24}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            labelFormatter={(day) => formatDayLabel(String(day))}
            formatter={(value) => [String(value), 'Views']}
          />
          <Bar dataKey="views" fill="var(--color-accent, #8bc8a3)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DateRangeFilter({
  preset,
  fromDay,
  toDay,
  onPresetChange,
  onCustomChange,
}: {
  preset: RangePreset;
  fromDay: string;
  toDay: string;
  onPresetChange: (preset: DatePreset) => void;
  onCustomChange: (fromDay: string, toDay: string) => void;
}) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.presets}>
        {DATE_PRESETS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.presetBtn} ${
              preset === option.value ? styles.presetBtnActive : ''
            }`}
            onClick={() => onPresetChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className={styles.customRange}>
        <label className={styles.dateField}>
          <span>From</span>
          <input
            type="date"
            value={fromDay}
            max={toDay}
            onChange={(e) => onCustomChange(e.target.value, toDay)}
            className={styles.dateInput}
          />
        </label>
        <label className={styles.dateField}>
          <span>To</span>
          <input
            type="date"
            value={toDay}
            min={fromDay}
            onChange={(e) => onCustomChange(fromDay, e.target.value)}
            className={styles.dateInput}
          />
        </label>
      </div>
    </div>
  );
}

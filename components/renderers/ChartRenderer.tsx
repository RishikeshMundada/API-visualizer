'use client';

import { useState } from 'react';
import { JsonValue } from '@/lib/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#D4A574', '#C8956A', '#8B7355', '#60A5FA', '#4ADE80'];

type ChartType = 'bar' | 'line' | 'pie';

export default function ChartRenderer({ data }: { data: JsonValue; analysis: any }) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const arr = data as any[];

  const isNumericArray = arr.length > 0 && arr.every((v: any) => typeof v === 'number');
  const isLabelValue = !isNumericArray && arr.length > 0 && arr.every((v: any) => {
    const keys = Object.keys(v);
    return keys.length === 2 &&
      keys.some((k: string) => typeof v[k] === 'string') &&
      keys.some((k: string) => typeof v[k] === 'number');
  });

  let chartData: Array<Record<string, any>> = [];
  let dataKey = '';
  let nameKey = '';

  if (isNumericArray) {
    chartData = arr.map((v, idx) => ({ index: idx, value: v }));
    dataKey = 'value';
    nameKey = 'index';
  } else if (isLabelValue) {
    const firstItem = arr[0];
    const keys = Object.keys(firstItem);
    nameKey = keys.find((k: string) => typeof firstItem[k] === 'string') || keys[0];
    dataKey = keys.find((k: string) => typeof firstItem[k] === 'number') || keys[1];
    chartData = arr.map((item: any) => ({
      [nameKey]: item[nameKey],
      [dataKey]: item[dataKey],
    }));
  }

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={nameKey} stroke="var(--text-secondary)" fontSize={11} />
            <YAxis stroke="var(--text-secondary)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey={dataKey} fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey={nameKey} stroke="var(--text-secondary)" fontSize={11} />
            <YAxis stroke="var(--text-secondary)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Line type="monotone" dataKey={dataKey} stroke={COLORS[0]} strokeWidth={2} dot={{ fill: COLORS[0] }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={chartData} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={150} label>
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {(['bar', 'line', 'pie'] as ChartType[]).map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className="px-3 py-1 text-xs rounded-full transition-colors"
            style={{
              backgroundColor: chartType === type ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: chartType === type ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: `1px solid ${chartType === type ? 'var(--accent-primary)' : 'var(--border)'}`,
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="p-4 rounded border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        {renderChart()}
      </div>
    </div>
  );
}

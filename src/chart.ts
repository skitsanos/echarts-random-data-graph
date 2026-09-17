import * as echarts from 'echarts/core';
import type { ECharts, EChartsOption } from 'echarts';
import { GridComponent, TooltipComponent, DataZoomComponent, ToolboxComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import type { Reading } from './data';

echarts.use([GridComponent, TooltipComponent, DataZoomComponent, ToolboxComponent, LineChart, CanvasRenderer]);

const colors = { text: '#8b9daf', grid: 'rgba(139, 157, 175, 0.12)', accent: '#f4c95d', band: 'rgba(91, 174, 168, 0.22)', muted: 'rgba(91, 174, 168, 0)' };

export function createChart(element: HTMLElement): ECharts {
  return echarts.init(element, undefined, { renderer: 'canvas' });
}

export function setChartOption(chart: ECharts, readings: Reading[]): void {
  const dates = readings.map(({ date }) => date.toISOString().slice(0, 10));
  const mean = readings.reduce((sum, reading) => sum + reading.value, 0) / readings.length;
  const option: EChartsOption = {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    grid: { top: 24, right: 24, bottom: 68, left: 50 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#132334',
      borderColor: 'rgba(244, 201, 93, 0.3)',
      borderWidth: 1,
      padding: [12, 14],
      textStyle: { color: '#e8eef2', fontFamily: 'Manrope, sans-serif' },
      axisPointer: { type: 'line', lineStyle: { color: 'rgba(244, 201, 93, 0.7)', width: 1 } },
      formatter: (params) => {
        const index = Array.isArray(params) && params[0]?.dataIndex !== undefined ? params[0].dataIndex : 0;
        const reading = readings[index];
        return `<div class="tooltip-date">${formatDate(reading.date, true)}</div><div class="tooltip-value">${reading.value.toFixed(2)} <span>units</span></div><div class="tooltip-range">Range ${reading.lower.toFixed(1)} — ${reading.upper.toFixed(1)}</div>`;
      },
    },
    toolbox: { right: 16, top: -6, itemSize: 14, iconStyle: { borderColor: colors.text }, emphasis: { iconStyle: { borderColor: colors.accent } }, feature: { restore: {}, saveAsImage: { backgroundColor: '#08131f', pixelRatio: 2 } } },
    xAxis: { type: 'category', boundaryGap: false, data: dates, axisLine: { lineStyle: { color: colors.grid } }, axisTick: { show: false }, axisLabel: { color: colors.text, fontSize: 11, margin: 14, formatter: (value: string) => formatDate(new Date(`${value}T00:00:00`)) } },
    yAxis: { type: 'value', min: 0, max: 110, splitNumber: 4, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: colors.text, fontSize: 11, margin: 12 }, splitLine: { lineStyle: { color: colors.grid, type: 'dashed' } } },
    dataZoom: [
      { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
      { type: 'slider', height: 4, bottom: 20, left: 50, right: 24, borderColor: 'transparent', backgroundColor: 'rgba(139, 157, 175, 0.08)', fillerColor: 'rgba(91, 174, 168, 0.32)', handleSize: 0, moveHandleSize: 0, textStyle: { color: 'transparent' } },
    ],
    series: [
      { name: 'Lower bound', type: 'line', stack: 'confidence', data: readings.map(({ lower }) => lower), lineStyle: { color: colors.muted, width: 0 }, areaStyle: { color: colors.muted }, symbol: 'none', silent: true },
      { name: 'Confidence band', type: 'line', stack: 'confidence', data: readings.map(({ lower, upper }) => upper - lower), lineStyle: { color: colors.muted, width: 0 }, areaStyle: { color: colors.band }, symbol: 'none', silent: true },
      { name: 'Reading', type: 'line', data: readings.map(({ value }) => value), showSymbol: false, smooth: 0.25, lineStyle: { color: colors.accent, width: 2.5 }, itemStyle: { color: colors.accent }, emphasis: { focus: 'series', scale: true, itemStyle: { borderColor: '#fff', borderWidth: 2 } }, markLine: { silent: true, symbol: 'none', label: { show: true, position: 'insideEndTop', color: colors.text, fontSize: 10, formatter: 'mean' }, lineStyle: { color: 'rgba(244, 201, 93, 0.35)', type: 'dashed' }, data: [{ yAxis: mean }] } },
    ],
  };

  chart.setOption(option, true);
}

function formatDate(date: Date, long = false): string {
  return new Intl.DateTimeFormat('en', long ? { month: 'short', day: 'numeric', year: 'numeric' } : { month: 'short', day: 'numeric' }).format(date);
}

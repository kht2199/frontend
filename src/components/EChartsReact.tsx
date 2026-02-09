import type { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";
import { type CSSProperties, useEffect, useRef } from "react";

interface EChartsReactProps {
	option: EChartsOption;
	style?: CSSProperties;
	className?: string;
	theme?: string | object;
	onChartReady?: (instance: ECharts) => void;
}

export default function EChartsReact({
	option,
	style,
	className,
	theme,
	onChartReady,
}: EChartsReactProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<ECharts | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const chart = echarts.init(container, theme);
		chartRef.current = chart;
		onChartReady?.(chart);

		const ro = new ResizeObserver(() => chart.resize());
		ro.observe(container);

		return () => {
			ro.disconnect();
			chart.dispose();
			chartRef.current = null;
		};
	}, [theme, onChartReady]);

	useEffect(() => {
		chartRef.current?.setOption(option, { notMerge: true });
	}, [option]);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{ width: "100%", height: 400, ...style }}
		/>
	);
}

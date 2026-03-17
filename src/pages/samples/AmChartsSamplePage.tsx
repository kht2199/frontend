import { Card, Col, Row, Typography } from "antd";
import AmChartsBarChart from "@/components/amcharts/AmChartsBarChart";
import AmChartsBarLineChart from "@/components/amcharts/AmChartsBarLineChart";
import AmChartsLineChart from "@/components/amcharts/AmChartsLineChart";
import AmChartsLineDualAxisChart from "@/components/amcharts/AmChartsLineDualAxisChart";
import AmChartsMultiLineChart from "@/components/amcharts/AmChartsMultiLineChart";
import AmChartsPieChart from "@/components/amcharts/AmChartsPieChart";

export default function AmChartsSamplePage() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				overflow: "auto",
			}}
		>
			<Typography.Title level={3} style={{ flexShrink: 0, marginBottom: 8 }}>
				amCharts Sample
			</Typography.Title>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card title="Bar Chart">
						<AmChartsBarChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Line Chart">
						<AmChartsLineChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Bar + Line Chart">
						<AmChartsBarLineChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Pie Chart">
						<AmChartsPieChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Dual Axis Line Chart (기온 vs 전력소비)">
						<AmChartsLineDualAxisChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Multi Line Chart (다양한 범위: 온도·기압·습도·CO₂)">
						<AmChartsMultiLineChart />
					</Card>
				</Col>
			</Row>
		</div>
	);
}

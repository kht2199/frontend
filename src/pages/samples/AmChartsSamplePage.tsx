import { Card, Col, Row, Typography } from "antd";
import AmChartsBarChart from "../../shared/components/amcharts/AmChartsBarChart";
import AmChartsBarLineChart from "../../shared/components/amcharts/AmChartsBarLineChart";
import AmChartsLineChart from "../../shared/components/amcharts/AmChartsLineChart";
import AmChartsLineDualAxisChart from "../../shared/components/amcharts/AmChartsLineDualAxisChart";
import AmChartsMultiLineChart from "../../shared/components/amcharts/AmChartsMultiLineChart";
import AmChartsPieChart from "../../shared/components/amcharts/AmChartsPieChart";

export default function AmChartsSamplePage() {
	return (
		<>
			<Typography.Title level={3}>amCharts Sample</Typography.Title>
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
		</>
	);
}

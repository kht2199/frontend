import { Card, Col, Row, Typography } from "antd";
import AmChartsBarChart from "../../shared/components/amcharts/AmChartsBarChart";
import AmChartsBarLineChart from "../../shared/components/amcharts/AmChartsBarLineChart";
import AmChartsLineChart from "../../shared/components/amcharts/AmChartsLineChart";
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
			</Row>
		</>
	);
}

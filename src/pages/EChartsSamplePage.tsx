import { Card, Col, Row, Typography } from "antd";
import EChartsBarChart from "../components/echarts/EChartsBarChart";
import EChartsBarLineChart from "../components/echarts/EChartsBarLineChart";
import EChartsLineChart from "../components/echarts/EChartsLineChart";
import EChartsPieChart from "../components/echarts/EChartsPieChart";

export default function EChartsSamplePage() {
	return (
		<>
			<Typography.Title level={3}>ECharts Sample</Typography.Title>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card title="Bar Chart">
						<EChartsBarChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Line Chart">
						<EChartsLineChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Bar + Line Chart">
						<EChartsBarLineChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Pie Chart">
						<EChartsPieChart />
					</Card>
				</Col>
			</Row>
		</>
	);
}

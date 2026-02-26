import { Card, Col, Row, Typography } from "antd";
import EChartsBarChart from "../../shared/components/echarts/EChartsBarChart";
import EChartsBarLineChart from "../../shared/components/echarts/EChartsBarLineChart";
import EChartsLineChart from "../../shared/components/echarts/EChartsLineChart";
import EChartsPieChart from "../../shared/components/echarts/EChartsPieChart";

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

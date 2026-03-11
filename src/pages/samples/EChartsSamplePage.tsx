import { Card, Col, Row, Typography } from "antd";
import EChartsBarChart from "../../shared/components/echarts/EChartsBarChart";
import EChartsBarLineChart from "../../shared/components/echarts/EChartsBarLineChart";
import EChartsLineChart from "../../shared/components/echarts/EChartsLineChart";
import EChartsLineDualAxisChart from "../../shared/components/echarts/EChartsLineDualAxisChart";
import EChartsMultiLineChart from "../../shared/components/echarts/EChartsMultiLineChart";
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
				<Col span={12}>
					<Card title="Dual Axis Line Chart (기온 vs 전력소비)">
						<EChartsLineDualAxisChart />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Multi Line Chart (다양한 범위: 온도·기압·습도·CO₂)">
						<EChartsMultiLineChart />
					</Card>
				</Col>
			</Row>
		</>
	);
}

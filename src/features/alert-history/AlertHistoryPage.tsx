import { Tabs, Typography } from "antd";
import AgGridAlertHistory from "./AgGridAlertHistory";
import AntdAlertHistory from "./AntdAlertHistory";
import SearchFilters from "./SearchFilters";

export default function AlertHistoryPage() {
	return (
		<>
			<Typography.Title level={3}>알림 이력</Typography.Title>
			<SearchFilters />
			<Tabs
				defaultActiveKey="agGrid"
				items={[
					{
						key: "agGrid",
						label: "AG Grid",
						children: <AgGridAlertHistory />,
					},
					{
						key: "antd",
						label: "Antd Table",
						children: <AntdAlertHistory />,
					},
				]}
			/>
		</>
	);
}

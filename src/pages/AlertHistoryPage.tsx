import { Tabs, Typography } from "antd";
import SearchFilters from "./alertHistory/SearchFilters";
import AgGridAlertHistory from "./alertHistory/AgGridAlertHistory";
import AntdAlertHistory from "./alertHistory/AntdAlertHistory";

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

import { Tabs, Typography } from "antd";
import AgGridAlertHistory from "./AgGridAlertHistory";
import AntdAlertHistory from "./AntdAlertHistory";
import SearchFilters from "./SearchFilters";

export default function AlertHistoryPage() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<Typography.Title level={3} style={{ flexShrink: 0, marginBottom: 8 }}>
				알림 이력
			</Typography.Title>
			<SearchFilters />
			<Tabs
				defaultActiveKey="agGrid"
				className="tabs-fill-height"
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
		</div>
	);
}

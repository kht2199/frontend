import type { ColDef } from "ag-grid-community";
import type { ColumnsType } from "antd/es/table";

export interface AlertHistoryRecord {
	id: number;
	occurredAt: string;
	sentAt: string;
	fabName: string;
	recipient: string;
	info: string;
}

export const agGridColumns: ColDef<AlertHistoryRecord>[] = [
	{ field: "occurredAt", headerName: "발생시각", flex: 1, minWidth: 160 },
	{ field: "sentAt", headerName: "전송시각", flex: 1, minWidth: 160 },
	{ field: "fabName", headerName: "FAB명", flex: 0.5, minWidth: 80 },
	{ field: "recipient", headerName: "받는사람", flex: 1, minWidth: 120 },
	{ field: "info", headerName: "정보", flex: 2, minWidth: 200 },
];

export const antdColumns: ColumnsType<AlertHistoryRecord> = [
	{
		title: "발생시각",
		dataIndex: "occurredAt",
		key: "occurredAt",
		width: 180,
	},
	{ title: "전송시각", dataIndex: "sentAt", key: "sentAt", width: 180 },
	{ title: "FAB명", dataIndex: "fabName", key: "fabName", width: 80 },
	{
		title: "받는사람",
		dataIndex: "recipient",
		key: "recipient",
		width: 140,
	},
	{ title: "정보", dataIndex: "info", key: "info", ellipsis: true },
];

import {
	AllCommunityModule,
	type GridApi,
	ModuleRegistry,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button, Form, notification, Select, Space, Typography } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import { TextField } from "../../shared/lib/antd";
import { generateContactData } from "./sampleData";
import { type ContactRecord, contactColumns } from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

let nextId = 101;

export default function ContactManagementPage() {
	const gridRef = useRef<AgGridReact<ContactRecord>>(null);
	const [rowData, setRowData] = useState<ContactRecord[]>(() =>
		generateContactData(),
	);
	const [selectedRows, setSelectedRows] = useState<ContactRecord[]>([]);
	const [notificationApi, contextHolder] = notification.useNotification();

	const [searchField] = useState("employeeId");
	const [searchValue, setSearchValue] = useState("");

	const filteredData = useMemo(() => {
		if (!searchValue.trim()) return rowData;
		return rowData.filter((r) =>
			r[searchField as keyof ContactRecord]
				?.toString()
				.toLowerCase()
				.includes(searchValue.trim().toLowerCase()),
		);
	}, [rowData, searchField, searchValue]);

	const onSelectionChanged = useCallback(() => {
		const api: GridApi<ContactRecord> | undefined = gridRef.current?.api;
		if (api) {
			setSelectedRows(api.getSelectedRows());
		}
	}, []);

	const handleAdd = useCallback(() => {
		const newRecord: ContactRecord = {
			id: nextId++,
			employeeId: "",
			name: "",
			phone: "",
			email: "",
			hireDate: "",
			birthDate: "",
			status: "재직",
		};
		setRowData((prev) => [newRecord, ...prev]);
		notificationApi.success({
			message: "새 행이 추가되었습니다. 셀을 클릭하여 편집하세요.",
		});
	}, [notificationApi]);

	const handleDelete = useCallback(() => {
		if (selectedRows.length === 0) {
			notificationApi.warning({ message: "삭제할 행을 선택하세요." });
			return;
		}
		const selectedIds = new Set(selectedRows.map((r) => r.id));
		setRowData((prev) => prev.filter((r) => !selectedIds.has(r.id)));
		setSelectedRows([]);
		notificationApi.success({
			message: `${selectedIds.size}건이 삭제되었습니다.`,
		});
	}, [selectedRows, notificationApi]);

	const handleApply = useCallback(() => {
		const api = gridRef.current?.api;
		if (!api) return;

		api.stopEditing();

		const updated: ContactRecord[] = [];
		api.forEachNode((node) => {
			if (node.data) {
				updated.push({ ...node.data });
			}
		});

		setRowData((prev) => {
			const visibleIds = new Set(updated.map((r) => r.id));
			const hidden = prev.filter((r) => !visibleIds.has(r.id));
			return [...updated, ...hidden];
		});

		notificationApi.success({ message: "변경사항이 적용되었습니다." });
	}, [notificationApi]);

	return (
		<>
			{contextHolder}
			<Typography.Title level={3}>연락처 관리</Typography.Title>

			<Form layout="inline" style={{ marginBottom: 16 }}>
				<Form.Item label="조회항목">
					<Select
						defaultValue="employeeId"
						style={{ width: 120 }}
						options={[{ label: "사번", value: "employeeId" }]}
					/>
				</Form.Item>
				<Form.Item label="조회 값">
					<TextField
						placeholder="검색어 입력"
						value={searchValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSearchValue(e.target.value)
						}
						style={{ width: 200 }}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary">조회</Button>
				</Form.Item>
			</Form>

			<Space style={{ marginBottom: 12 }}>
				<Button onClick={handleAdd}>추가</Button>
				<Button danger onClick={handleDelete}>
					삭제
				</Button>
				<Button type="primary" onClick={handleApply}>
					적용
				</Button>
			</Space>

			<div className="ag-theme-quartz" style={{ height: 600 }}>
				<AgGridReact<ContactRecord>
					ref={gridRef}
					rowData={filteredData}
					columnDefs={contactColumns}
					rowSelection="multiple"
					onSelectionChanged={onSelectionChanged}
					pagination={true}
					paginationPageSize={20}
					paginationPageSizeSelector={[10, 20, 50, 100]}
					getRowId={(params) => params.data.id.toString()}
					singleClickEdit={true}
					stopEditingWhenCellsLoseFocus={true}
				/>
			</div>
		</>
	);
}

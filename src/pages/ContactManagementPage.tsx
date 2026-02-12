import { useCallback, useMemo, useRef, useState } from "react";
import { Button, Form, Input, Select, Space, Typography, message } from "antd";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	type GridApi,
	ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { contactColumns, type ContactRecord } from "./contactManagement/types";
import { generateContactData } from "./contactManagement/sampleData";

ModuleRegistry.registerModules([AllCommunityModule]);

let nextId = 101;

export default function ContactManagementPage() {
	const gridRef = useRef<AgGridReact<ContactRecord>>(null);
	const [rowData, setRowData] = useState<ContactRecord[]>(() =>
		generateContactData(),
	);
	const [selectedRows, setSelectedRows] = useState<ContactRecord[]>([]);
	const [messageApi, contextHolder] = message.useMessage();

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
		const api: GridApi<ContactRecord> | undefined =
			gridRef.current?.api;
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
		messageApi.success("새 행이 추가되었습니다. 셀을 클릭하여 편집하세요.");
	}, [messageApi]);

	const handleDelete = useCallback(() => {
		if (selectedRows.length === 0) {
			messageApi.warning("삭제할 행을 선택하세요.");
			return;
		}
		const selectedIds = new Set(selectedRows.map((r) => r.id));
		setRowData((prev) => prev.filter((r) => !selectedIds.has(r.id)));
		setSelectedRows([]);
		messageApi.success(`${selectedIds.size}건이 삭제되었습니다.`);
	}, [selectedRows, messageApi]);

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

		messageApi.success("변경사항이 적용되었습니다.");
	}, [messageApi]);

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
					<Input
						placeholder="검색어 입력"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
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

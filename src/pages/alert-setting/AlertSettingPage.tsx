import {
	AllCommunityModule,
	type GridApi,
	ModuleRegistry,
	type RowClickedEvent,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Button, Card, Col, Form, Row, Select, Tabs, Typography } from "antd";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	generateCategories,
	generateDetails,
	generateProperties,
	generateRecipients,
} from "./sampleData";
import {
	type CategoryRecord,
	categoryColumns,
	detailColumns,
	propertyColumns,
	recipientColumns,
} from "./types";

ModuleRegistry.registerModules([AllCommunityModule]);

const GRID_HEIGHT = 320;

export default function AlertSettingPage() {
	const categoryGridRef = useRef<AgGridReact<CategoryRecord>>(null);

	const categories = useMemo(() => generateCategories(), []);
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const properties = useMemo(
		() => (selectedId ? generateProperties(selectedId) : []),
		[selectedId],
	);
	const recipients = useMemo(
		() => (selectedId ? generateRecipients(selectedId) : []),
		[selectedId],
	);
	const details = useMemo(
		() => (selectedId ? generateDetails(selectedId) : []),
		[selectedId],
	);

	const onCategoryRowClicked = useCallback(
		(event: RowClickedEvent<CategoryRecord>) => {
			if (event.data) {
				setSelectedId(event.data.id);
			}
		},
		[],
	);

	const onCategoryReady = useCallback(
		(params: { api: GridApi<CategoryRecord> }) => {
			const firstNode = params.api.getDisplayedRowAtIndex(0);
			if (firstNode) {
				firstNode.setSelected(true);
				setSelectedId(firstNode.data?.id ?? null);
			}
		},
		[],
	);

	return (
		<>
			<Typography.Title level={3}>알람 설정</Typography.Title>

			<Form layout="inline" style={{ marginBottom: 16 }}>
				<Form.Item label="Fab">
					<Select
						defaultValue="A"
						style={{ width: 120 }}
						options={[
							{ label: "A", value: "A" },
							{ label: "B", value: "B" },
						]}
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary">조회</Button>
				</Form.Item>
			</Form>

			<Row gutter={[16, 16]}>
				{/* 테이블 1: 카테고리 목록 */}
				<Col span={12}>
					<Card title="Category">
						<div className="ag-theme-quartz" style={{ height: GRID_HEIGHT }}>
							<AgGridReact
								ref={categoryGridRef}
								rowData={categories}
								columnDefs={categoryColumns}
								rowSelection="single"
								onRowClicked={onCategoryRowClicked}
								onGridReady={onCategoryReady}
								getRowId={(p) => p.data.id.toString()}
							/>
						</div>
					</Card>
				</Col>

				{/* 테이블 2: 속성 */}
				<Col span={12}>
					<Card title="Properties">
						<div className="ag-theme-quartz" style={{ height: GRID_HEIGHT }}>
							<AgGridReact
								rowData={properties}
								columnDefs={propertyColumns}
								getRowId={(p) => p.data.id.toString()}
								singleClickEdit={true}
							/>
						</div>
					</Card>
				</Col>

				{/* 테이블 3: 알림 수신자 (탭: Email, Phone, Sound) */}
				<Col span={12}>
					<Card title="알림 설정">
						<Tabs
							defaultActiveKey="email"
							size="small"
							items={[
								{
									key: "email",
									label: "Email",
									children: (
										<div
											className="ag-theme-quartz"
											style={{ height: GRID_HEIGHT - 46 }}
										>
											<AgGridReact
												rowData={recipients}
												columnDefs={recipientColumns}
												getRowId={(p) => p.data.id.toString()}
												singleClickEdit={true}
											/>
										</div>
									),
								},
								{
									key: "phone",
									label: "Phone",
									children: (
										<div
											className="ag-theme-quartz"
											style={{ height: GRID_HEIGHT - 46 }}
										>
											<AgGridReact
												rowData={recipients}
												columnDefs={recipientColumns}
												getRowId={(p) => p.data.id.toString()}
												singleClickEdit={true}
											/>
										</div>
									),
								},
								{
									key: "sound",
									label: "Sound",
									children: (
										<div
											className="ag-theme-quartz"
											style={{ height: GRID_HEIGHT - 46 }}
										>
											<AgGridReact
												rowData={recipients}
												columnDefs={recipientColumns}
												getRowId={(p) => p.data.id.toString()}
												singleClickEdit={true}
											/>
										</div>
									),
								},
							]}
						/>
					</Card>
				</Col>

				{/* 테이블 4: 상세 항목 */}
				<Col span={12}>
					<Card title="상세 정보">
						<div className="ag-theme-quartz" style={{ height: GRID_HEIGHT }}>
							<AgGridReact
								rowData={details}
								columnDefs={detailColumns}
								getRowId={(p) => p.data.id.toString()}
								singleClickEdit={true}
							/>
						</div>
					</Card>
				</Col>
			</Row>
		</>
	);
}

import type { ColDef } from "ag-grid-community";

// 테이블 1: 카테고리 목록
export interface CategoryRecord {
	id: number;
	categoryType: string;
	categoryCode: string;
	groupCode: string;
	description: string;
}

// 테이블 2: 속성-값
export interface PropertyRecord {
	id: number;
	property: string;
	value: string;
}

// 테이블 3: 알림 수신자
export interface RecipientRecord {
	id: number;
	name: string;
	receive: boolean;
}

// 테이블 4: 항목-값-비고
export interface DetailRecord {
	id: number;
	item: string;
	value: string;
	remark: string;
}

export const categoryColumns: ColDef<CategoryRecord>[] = [
	{ field: "id", headerName: "ID", width: 70 },
	{
		field: "categoryType",
		headerName: "Category Type",
		flex: 1,
		minWidth: 130,
	},
	{
		field: "categoryCode",
		headerName: "Category Code",
		flex: 1,
		minWidth: 130,
	},
	{ field: "groupCode", headerName: "Group Code", flex: 1, minWidth: 120 },
	{ field: "description", headerName: "Description", flex: 1.5, minWidth: 180 },
];

export const propertyColumns: ColDef<PropertyRecord>[] = [
	{ field: "property", headerName: "Property", flex: 1, minWidth: 150 },
	{
		field: "value",
		headerName: "Value",
		flex: 1.5,
		minWidth: 200,
		editable: true,
	},
];

export const recipientColumns: ColDef<RecipientRecord>[] = [
	{ field: "id", headerName: "ID", width: 70 },
	{ field: "name", headerName: "성명", flex: 1, minWidth: 120 },
	{
		field: "receive",
		headerName: "수신",
		width: 80,
		cellDataType: "boolean",
		editable: true,
	},
];

export const detailColumns: ColDef<DetailRecord>[] = [
	{ field: "item", headerName: "항목", flex: 1, minWidth: 150 },
	{
		field: "value",
		headerName: "값",
		flex: 1.5,
		minWidth: 200,
		editable: true,
	},
	{
		field: "remark",
		headerName: "비고",
		flex: 1,
		minWidth: 150,
		editable: true,
	},
];

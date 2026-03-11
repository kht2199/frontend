import type { ColDef, ColGroupDef } from "ag-grid-community";

export interface ContactRecord {
	id: number;
	employeeId: string;
	name: string;
	phone: string;
	email: string;
	hireDate: string;
	birthDate: string;
	status: string;
}

export const contactColumns: (
	| ColDef<ContactRecord>
	| ColGroupDef<ContactRecord>
)[] = [
	{
		field: "employeeId",
		headerName: "사번",
		width: 110,
		editable: true,
	},
	{
		field: "name",
		headerName: "성명",
		width: 100,
		editable: true,
	},
	{
		field: "phone",
		headerName: "연락처",
		width: 140,
		editable: true,
	},
	{
		field: "email",
		headerName: "이메일",
		flex: 1,
		minWidth: 200,
		editable: true,
	},
	{
		headerName: "기타정보",
		children: [
			{
				field: "hireDate",
				headerName: "입사일",
				width: 120,
				editable: true,
			},
			{
				field: "birthDate",
				headerName: "생년월일",
				width: 120,
				editable: true,
			},
			{
				field: "status",
				headerName: "상태",
				width: 100,
				editable: true,
				cellEditor: "agSelectCellEditor",
				cellEditorParams: {
					values: ["재직", "휴직", "퇴직"],
				},
			},
		],
	},
];

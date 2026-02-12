import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
	AllCommunityModule,
	ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { agGridColumns, type AlertHistoryRecord } from "./columns";
import { generateSampleData } from "./sampleData";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AgGridAlertHistory() {
	const rowData = useMemo<AlertHistoryRecord[]>(
		() => generateSampleData(),
		[],
	);

	return (
		<div className="ag-theme-quartz" style={{ height: 600 }}>
			<AgGridReact<AlertHistoryRecord>
				rowData={rowData}
				columnDefs={agGridColumns}
				pagination={true}
				paginationPageSize={20}
				paginationPageSizeSelector={[10, 20, 50, 100]}
			/>
		</div>
	);
}

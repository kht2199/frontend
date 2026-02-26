import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { type AlertHistoryRecord, agGridColumns } from "./columns";
import { generateSampleData } from "./sampleData";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AgGridAlertHistory() {
	const rowData = useMemo<AlertHistoryRecord[]>(() => generateSampleData(), []);

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

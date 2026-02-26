import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AlertHistoryPage from "./features/alert-history/AlertHistoryPage";
import AlertSettingPage from "./features/alert-setting/AlertSettingPage";
import ContactManagementPage from "./features/contact-management/ContactManagementPage";
import LlmPage from "./features/llm/LlmPage";
import MainPage from "./features/main/MainPage";
import BridgeMonitoringPage from "./features/monitoring/BridgeMonitoringPage";
import FabCustomMonitoringPage from "./features/monitoring/FabCustomMonitoringPage";
import FabLayoutMonitoringPage from "./features/monitoring/FabLayoutMonitoringPage";
import FabMonitoringPage from "./features/monitoring/FabMonitoringPage";
import ServerMonitoringPage from "./features/monitoring/ServerMonitoringPage";
import AmChartsSamplePage from "./features/samples/AmChartsSamplePage";
import EChartsSamplePage from "./features/samples/EChartsSamplePage";
import DefaultLayout from "./layouts/DefaultLayout";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<DefaultLayout />}>
					<Route index element={<MainPage />} />
					<Route path="monitor">
						<Route index element={<Navigate to="fab" replace />} />
						<Route path="fab" element={<FabMonitoringPage />} />
						<Route path="fab-layout" element={<FabLayoutMonitoringPage />} />
						<Route path="bridge" element={<BridgeMonitoringPage />} />
						<Route path="fab-custom" element={<FabCustomMonitoringPage />} />
						<Route path="server" element={<ServerMonitoringPage />} />
					</Route>
					<Route path="history/alert" element={<AlertHistoryPage />} />
					<Route path="llm" element={<LlmPage />} />
					<Route path="manage/contact" element={<ContactManagementPage />} />
					<Route path="settings/alert" element={<AlertSettingPage />} />
					<Route path="sample/echarts" element={<EChartsSamplePage />} />
					<Route path="sample/amcharts" element={<AmChartsSamplePage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

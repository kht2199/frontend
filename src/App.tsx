import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import AlertHistoryPage from "./pages/AlertHistoryPage";
import AlertSettingPage from "./pages/AlertSettingPage";
import AmChartsSamplePage from "./pages/AmChartsSamplePage";
import BridgeMonitoringPage from "./pages/BridgeMonitoringPage";
import ContactManagementPage from "./pages/ContactManagementPage";
import EChartsSamplePage from "./pages/EChartsSamplePage";
import FabCustomMonitoringPage from "./pages/FabCustomMonitoringPage";
import FabMonitoringPage from "./pages/FabMonitoringPage";
import LlmPage from "./pages/LlmPage";
import MainPage from "./pages/MainPage";
import ServerMonitoringPage from "./pages/ServerMonitoringPage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<DefaultLayout />}>
					<Route index element={<MainPage />} />
					<Route path="monitor">
						<Route index element={<Navigate to="fab" replace />} />
						<Route path="fab" element={<FabMonitoringPage />} />
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

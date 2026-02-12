import { Form, Layout, Menu, Select } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Header, Content } = Layout;

const navItems: MenuProps["items"] = [
	{
		key: "monitor",
		label: "모니터링",
		children: [
			{ key: "/monitor/fab", label: "Fab Monitoring" },
			{ key: "/monitor/bridge", label: "Bridge Monitoring" },
			{ key: "/monitor/fab-custom", label: "Fab Custom Monitoring" },
			{ key: "/monitor/server", label: "Server Monitoring" },
		],
	},
	{ key: "/settings/alert", label: "알람" },
	{ key: "/history/alert", label: "이력 관리" },
	{ key: "/llm", label: "LLM" },
	{ key: "/manage/contact", label: "관리자" },
	{
		key: "sample",
		label: "샘플",
		children: [
			{ key: "/sample/echarts", label: "ECharts" },
			{ key: "/sample/amcharts", label: "AmCharts" },
		],
	},
];

export default function DefaultLayout() {
	const navigate = useNavigate();
	const location = useLocation();

	const onClick: MenuProps["onClick"] = ({ key }) => {
		navigate(key);
	};

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header style={{ display: "flex", alignItems: "center" }}>
				<Menu
					theme="dark"
					mode="horizontal"
					selectedKeys={[location.pathname]}
					items={navItems}
					onClick={onClick}
					style={{ flex: 1 }}
				/>
			</Header>
			<Content style={{ padding: 24 }}>
				<Form layout="vertical" style={{ width: "100%", marginBottom: 24 }}>
					<Form.Item label="관제 Site" style={{ marginBottom: 0 }}>
						<Select defaultValue="이천" style={{ width: "100%" }}>
							<Select.Option value="이천">이천</Select.Option>
							<Select.Option value="청주" disabled>
								청주
							</Select.Option>
						</Select>
					</Form.Item>
				</Form>
				<Outlet />
			</Content>
		</Layout>
	);
}

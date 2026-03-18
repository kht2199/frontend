import {
	Badge,
	Card,
	Divider,
	Flex,
	Statistic,
	Tabs,
	Tag,
	Typography,
} from "antd";
import { useMemo, useState } from "react";
import { type Alarm, useAlarms } from "../../../api/hooks/useAlarms";
import TrendPanel from "./TrendPanel";

type AlarmState = "error" | "warning" | "normal";

function levelToState(level: number): AlarmState {
	if (level <= 2) return "error";
	if (level <= 4) return "warning";
	return "normal";
}

const STATE_CARD_STYLE: Record<
	AlarmState,
	{ border: string; background: string; color: string }
> = {
	error: { border: "#ff4d4f", background: "#ff4d4f", color: "#fff" },
	warning: { border: "#faad14", background: "#faad14", color: "#fff" },
	normal: { border: "#52c41a", background: "#52c41a", color: "#fff" },
};

const STATE_ALARM_STYLE: Record<
	AlarmState,
	{ border: string; background: string; color: string; subColor: string }
> = {
	error: {
		border: "#ff4d4f",
		background: "#fff1f0",
		color: "#cf1322",
		subColor: "#ff4d4f",
	},
	warning: {
		border: "#faad14",
		background: "#fffbe6",
		color: "#ad6800",
		subColor: "#faad14",
	},
	normal: {
		border: "#52c41a",
		background: "#f6ffed",
		color: "#389e0d",
		subColor: "#52c41a",
	},
};

const STATE_TAG_COLOR: Record<AlarmState, string> = {
	error: "error",
	warning: "warning",
	normal: "success",
};

const STATE_BADGE_STATUS: Record<AlarmState, "error" | "warning" | "success"> =
	{
		error: "error",
		warning: "warning",
		normal: "success",
	};

function LevelSummaryCard({
	label,
	count,
	state,
}: {
	label: string;
	count: number;
	state: AlarmState;
}) {
	const { border, background, color } = STATE_CARD_STYLE[state];
	return (
		<Card
			style={{
				flex: 1,
				border: `1px solid ${border}`,
				background,
				textAlign: "center",
				borderRadius: 0,
			}}
			styles={{ body: { padding: "6px 4px" } }}
		>
			<Statistic
				title={<span style={{ fontSize: 10, color }}>{label}</span>}
				value={count}
				valueStyle={{ fontSize: 18, color }}
			/>
		</Card>
	);
}

function AlarmCardItem({ alarm }: { alarm: Alarm }) {
	const state = levelToState(alarm.level);
	const { border, background, color, subColor } = STATE_ALARM_STYLE[state];
	return (
		<Card
			style={{
				border: `1px solid ${border}`,
				background,
				marginBottom: 6,
				borderRadius: 0,
			}}
			styles={{ body: { padding: "6px 10px" } }}
		>
			<Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
				<Flex align="center" gap={6}>
					<Badge status={STATE_BADGE_STATUS[state]} />
					<Typography.Text
						strong
						style={{
							fontSize: 14,
							fontWeight: 700,
							color,
							whiteSpace: "nowrap",
						}}
					>
						{alarm.fabId}
					</Typography.Text>
					<Typography.Text
						style={{ fontSize: 11, color, whiteSpace: "nowrap" }}
					>
						{alarm.message}
					</Typography.Text>
				</Flex>
				<Tag
					color={STATE_TAG_COLOR[state]}
					style={{ margin: "0 0 0 4px", fontSize: 10, flexShrink: 0 }}
				>
					L{alarm.level}
				</Tag>
			</Flex>
			<Typography.Text style={{ fontSize: 10, color: subColor }}>
				{alarm.occurredAt}
			</Typography.Text>
		</Card>
	);
}

const ALL_LEVELS = [1, 2, 3, 4, 5];

function TodaysAlarmContent() {
	const alarms = useAlarms();

	const levelCounts = useMemo(
		() =>
			ALL_LEVELS.map((level) => ({
				label: `LV${level}`,
				count: alarms.filter((a) => a.level === level).length,
				state: levelToState(level),
			})),
		[alarms],
	);

	const levelGroups = useMemo(
		() =>
			ALL_LEVELS.map((level) => ({
				level,
				alarms: alarms.filter((a) => a.level === level),
			})),
		[alarms],
	);

	return (
		<>
			<Flex gap={4} style={{ marginBottom: 16 }}>
				{levelCounts.map((lv) => (
					<LevelSummaryCard key={lv.label} {...lv} />
				))}
			</Flex>

			{levelGroups.map((g) => (
				<div key={g.level}>
					<Divider
						orientation="left"
						orientationMargin={0}
						plain
						style={{ margin: "10px 0 8px", fontSize: 14, fontWeight: 700 }}
					>
						Level {g.level}
					</Divider>
					{g.alarms.map((alarm) => (
						<AlarmCardItem key={alarm.alarmId} alarm={alarm} />
					))}
				</div>
			))}
		</>
	);
}

export default function AlarmPanel() {
	const [activeTab, setActiveTab] = useState("alarm");

	return (
		<div style={{ height: "100%", overflowY: "auto" }}>
			<Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				size="small"
				style={{ padding: "0 10px" }}
				destroyInactiveTabPane
				items={[
					{
						key: "alarm",
						label: "Today's Alarm",
						children: <TodaysAlarmContent />,
					},
					{
						key: "trend",
						label: "Trend",
						children: <TrendPanel isActive={activeTab === "trend"} />,
					},
				]}
			/>
		</div>
	);
}

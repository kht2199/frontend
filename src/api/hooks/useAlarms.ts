import { useQuery } from "@tanstack/react-query";

export type Alarm = {
	alarmId: string;
	fabId: string;
	message: string;
	level: number;
	occurredAt: string;
	details: string;
};

const SAMPLE_ALARMS: Alarm[] = [
	{
		alarmId: "ALM-001",
		fabId: "M14",
		message: "Current Queue too High",
		level: 1,
		occurredAt: "2026-03-18 10:32",
		details: "Queue length exceeded threshold of 500",
	},
	{
		alarmId: "ALM-002",
		fabId: "M07",
		message: "Temperature Exceeded",
		level: 1,
		occurredAt: "2026-03-18 09:51",
		details: "Chamber temperature reached 320°C (limit: 300°C)",
	},
	{
		alarmId: "ALM-003",
		fabId: "M08",
		message: "Pressure Sensor Fault",
		level: 2,
		occurredAt: "2026-03-18 11:05",
		details: "Pressure sensor P-3 returned invalid reading",
	},
	{
		alarmId: "ALM-004",
		fabId: "M21",
		message: "Flow Rate Warning",
		level: 2,
		occurredAt: "2026-03-18 10:44",
		details: "Gas flow rate deviation exceeds 5%",
	},
	{
		alarmId: "ALM-005",
		fabId: "M03",
		message: "Vibration Detected",
		level: 3,
		occurredAt: "2026-03-18 08:20",
		details: "Abnormal vibration on pump unit P-7",
	},
	{
		alarmId: "ALM-006",
		fabId: "M11",
		message: "Maintenance Scheduled",
		level: 4,
		occurredAt: "2026-03-18 07:00",
		details: "Scheduled PM due within 48 hours",
	},
	{
		alarmId: "ALM-007",
		fabId: "M05",
		message: "System Normal",
		level: 5,
		occurredAt: "2026-03-18 06:30",
		details: "All parameters within normal range",
	},
];

const USE_MOCK = import.meta.env.VITE_USE_MOCK_ALARMS === "true";

export function useAlarms() {
	return useQuery<Alarm[]>({
		queryKey: ["alarms", { useMock: USE_MOCK }],
		queryFn: async () => {
			if (USE_MOCK) return SAMPLE_ALARMS;
			const res = await fetch("http://localhost:8080/api/v1/alarms");
			if (!res.ok) throw new Error("Failed to fetch alarms");
			return res.json();
		},
	});
}

import type { AlertHistoryRecord } from "./columns";

const FAB_NAMES = ["A", "B"];
const SEND_TYPES = [
	"SMS",
	"Pager",
	"Sound",
	"AWS Popup",
	"EMS",
	"Mail",
	"MCS Popup",
	"Integrated",
];
const RECIPIENTS = [
	"홍길동",
	"김철수",
	"이영희",
	"박지민",
	"최수진",
	"정민호",
	"강서연",
	"윤태현",
];
const ALERT_MESSAGES = [
	"Temperature exceeded threshold",
	"Pressure anomaly detected",
	"Equipment maintenance required",
	"Sensor disconnected",
	"Power supply warning",
	"Network latency high",
	"Disk usage exceeded 90%",
	"Process timeout occurred",
	"Vibration level abnormal",
	"Humidity out of range",
];

function pad(n: number): string {
	return n.toString().padStart(2, "0");
}

function formatDate(date: Date): string {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function pick<T>(arr: T[], index: number): T {
	return arr[index % arr.length];
}

export function generateSampleData(): AlertHistoryRecord[] {
	const baseDate = new Date(2025, 0, 15, 8, 0, 0);
	const records: AlertHistoryRecord[] = [];

	for (let i = 0; i < 100; i++) {
		const occurredDate = new Date(baseDate.getTime() + i * 15 * 60 * 1000);
		const sentDate = new Date(occurredDate.getTime() + ((i * 7) % 30) * 1000);
		const sendType = pick(SEND_TYPES, i * 3 + 1);

		records.push({
			id: i + 1,
			occurredAt: formatDate(occurredDate),
			sentAt: formatDate(sentDate),
			fabName: pick(FAB_NAMES, i),
			recipient: pick(RECIPIENTS, i * 3),
			info: `[${sendType}] ${pick(ALERT_MESSAGES, i * 7)}`,
		});
	}

	return records;
}

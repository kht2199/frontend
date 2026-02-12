import type { ContactRecord } from "./types";

const LAST_NAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
const FIRST_NAMES = [
	"민수",
	"서연",
	"지훈",
	"수빈",
	"현우",
	"예진",
	"태현",
	"하은",
	"준영",
	"다은",
	"성호",
	"지민",
	"우진",
	"소영",
	"동혁",
	"유진",
	"승현",
	"미래",
	"재원",
	"나연",
];
const STATUSES = ["재직", "재직", "재직", "재직", "휴직", "퇴직"];

function pad(n: number): string {
	return n.toString().padStart(2, "0");
}

function formatDate(year: number, month: number, day: number): string {
	return `${year}-${pad(month)}-${pad(day)}`;
}

export function generateContactData(): ContactRecord[] {
	const records: ContactRecord[] = [];

	for (let i = 0; i < 100; i++) {
		const lastIdx = i % LAST_NAMES.length;
		const firstIdx = i % FIRST_NAMES.length;
		const name = LAST_NAMES[lastIdx] + FIRST_NAMES[firstIdx];

		const hireYear = 2015 + (i % 10);
		const hireMonth = (i % 12) + 1;
		const hireDay = (i % 28) + 1;

		const birthYear = 1975 + (i % 25);
		const birthMonth = ((i * 3) % 12) + 1;
		const birthDay = ((i * 7) % 28) + 1;

		records.push({
			id: i + 1,
			employeeId: `EMP${(1001 + i).toString()}`,
			name,
			phone: `010-${pad(Math.floor(((i * 37 + 11) % 90) + 10))}${pad(Math.floor(((i * 53 + 7) % 90) + 10))}-${pad(Math.floor(((i * 71 + 3) % 90) + 10))}${pad(Math.floor(((i * 13 + 29) % 90) + 10))}`,
			email: `emp${1001 + i}@company.com`,
			hireDate: formatDate(hireYear, hireMonth, hireDay),
			birthDate: formatDate(birthYear, birthMonth, birthDay),
			status: STATUSES[i % STATUSES.length],
		});
	}

	return records;
}

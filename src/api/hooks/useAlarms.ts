import { useQuery } from "@tanstack/react-query";

export type Alarm = {
	alarmId: string;
	fabId: string;
	message: string;
	level: number;
	occurredAt: string;
	details: string;
};

export function useAlarms() {
	return useQuery<Alarm[]>({
		queryKey: ["alarms"],
		queryFn: async () => {
			const res = await fetch("http://localhost:8080/api/v1/alarms");
			if (!res.ok) throw new Error("Failed to fetch alarms");
			return res.json();
		},
	});
}

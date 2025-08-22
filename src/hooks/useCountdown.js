//horario de funcionamento
import { useEffect, useState } from "react";

// Configurações dos horários
const morningOpen = 10;
const morningClose = 16;
const eveningOpen = 18;
const eveningClose = 23;

const useCountdown = () => {
	const calculateTimeLeft = () => {
		const now = new Date();
		const currentDay = now.getDay(); // 0 = domingo
		const currentHour = now.getHours();

		// Domingo fechado → só abre segunda às 10h
		if (currentDay === 0) {
			const nextMonday = new Date();
			nextMonday.setDate(now.getDate() + ((1 + 7 - currentDay) % 7)); // próxima segunda
			nextMonday.setHours(morningOpen, 0, 0, 0);
			return { label: "Abrimos em", targetDate: nextMonday };
		}

		let targetDate = new Date();
		let label = "";

		if (currentHour < morningOpen) {
			// Antes de abrir de manhã
			targetDate.setHours(morningOpen, 0, 0, 0);
			label = "Abrimos em";
		} else if (currentHour >= morningOpen && currentHour < morningClose) {
			// Estamos abertos de manhã
			targetDate.setHours(morningClose, 0, 0, 0);
			label = "Fechamos em";
		} else if (currentHour >= morningClose && currentHour < eveningOpen) {
			// Fechado à tarde
			targetDate.setHours(eveningOpen, 0, 0, 0);
			label = "Abrimos em";
		} else if (currentHour >= eveningOpen && currentHour < eveningClose) {
			// Aberto à noite
			targetDate.setHours(eveningClose, 0, 0, 0);
			label = "Fechamos em";
		} else {
			// Passou do horário → próximo dia às 10h
			targetDate.setDate(targetDate.getDate() + 1);
			targetDate.setHours(morningOpen, 0, 0, 0);
			label = "Abrimos amanhã em";
		}

		return { label, targetDate };
	};

	const [timeLeft, setTimeLeft] = useState(() => {
		const { label, targetDate } = calculateTimeLeft();
		return { label, difference: targetDate - new Date() };
	});

	useEffect(() => {
		const timer = setInterval(() => {
			const { label, targetDate } = calculateTimeLeft();
			setTimeLeft({ label, difference: targetDate - new Date() });
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (ms) => {
		if (ms <= 0) return "Em breve...";

		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
			2,
			"0"
		)}m ${String(seconds).padStart(2, "0")}s`;
	};

	return `${timeLeft.label} ${formatTime(timeLeft.difference)}`;
};

export default useCountdown;

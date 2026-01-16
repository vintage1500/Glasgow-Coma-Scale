export const EYE_OPTIONS = [
  { label: "4 — Спонтанно", value: 4 },
  { label: "3 — На обращение", value: 3 },
  { label: "2 — На боль", value: 2 },
  { label: "1 — Нет", value: 1 },
];

export const VERBAL_OPTIONS = [
  { label: "5 — Ориентирован", value: 5 },
  { label: "4 — Спутанная речь", value: 4 },
  { label: "3 — Неподходящие слова", value: 3 },
  { label: "2 — Нечленораздельные звуки", value: 2 },
  { label: "1 — Нет", value: 1 },
];

export const MOTOR_OPTIONS = [
  { label: "6 — Выполняет команды", value: 6 },
  { label: "5 — Локализует боль", value: 5 },
  { label: "4 — Отдёргивает на боль", value: 4 },
  { label: "3 — Патологическое сгибание", value: 3 },
  { label: "2 — Разгибание", value: 2 },
  { label: "1 — Нет", value: 1 },
];

export function interpretGcs(total) {
  // Часто используемая интерпретация (для курсового достаточно)
  if (total <= 8) return "Тяжёлая травма/кома (≤ 8)";
  if (total <= 12) return "Умеренное нарушение сознания (9–12)";
  return "Лёгкое нарушение / ясное сознание (13–15)";
}

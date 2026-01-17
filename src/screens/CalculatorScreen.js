import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { getCurrentUser } from "../utils/auth";
import { EYE_OPTIONS, VERBAL_OPTIONS, MOTOR_OPTIONS, interpretGcs } from "../utils/gcs";
import { run } from "../db/database";

function OptionGroup({ title, options, value, setValue }) {
  return (
    <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 10 }}>
      <Text style={{ fontWeight: "800", fontSize: 16 }}>{title}</Text>

      {options.map((o) => {
        const selected = value === o.value;

        return (
          <View
            key={o.value}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text style={{ flex: 1, paddingRight: 8, lineHeight: 20 }}>{o.label}</Text>

            <Pressable
              onPress={() => setValue(o.value)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: selected ? "#0b3d91" : "#1976d2",
              }}
            >
              <Text style={{ color: "white", fontWeight: "800" }}>
                {selected ? "ВЫБРАНО" : "ВЫБРАТЬ"}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

export default function CalculatorScreen({ navigation }) {
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);

  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => setUser(await getCurrentUser()))();
  }, []);

  function nowIso() {
    return new Date().toISOString();
  }

  function calculateAndSave() {
    const total = eye + verbal + motor;
    const interpretation = interpretGcs(total);
    setResult({ total, interpretation });

    if (user?.id) {
      run(
        `INSERT INTO history (user_id, eye, verbal, motor, total, interpretation, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.id, eye, verbal, motor, total, interpretation, nowIso()]
      );
    }

    Alert.alert("Результат", `ШКГ = ${total}\n${interpretation}`);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
      {/* Верхние кнопки */}
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
          <Pressable
            onPress={() => navigation.navigate("History")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: "#1976d2",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>ИСТОРИЯ</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: "#1976d2",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>ПРОФИЛЬ</Text>
          </Pressable>
        </View>

        {/* НОВАЯ КНОПКА */}
        <Pressable
          onPress={() => navigation.navigate("Stats")}
          style={{
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: "#1976d2",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "800" }}>СТАТИСТИКА</Text>
        </Pressable>
      </View>

      {/* Вводный текст */}
      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "800" }}>О калькуляторе</Text>
        <Text style={{ lineHeight: 20 }}>
          Этот калькулятор помогает быстро рассчитать оценку по Шкале комы Глазго (ШКГ) на основе
          трёх параметров: открывание глаз (E), речевая реакция (V) и двигательная реакция (M).
          Выберите значения и нажмите «Рассчитать».
        </Text>
      </View>

      {/* Группы */}
      <OptionGroup title="Открывание глаз (E)" options={EYE_OPTIONS} value={eye} setValue={setEye} />
      <OptionGroup title="Речевая реакция (V)" options={VERBAL_OPTIONS} value={verbal} setValue={setVerbal} />
      <OptionGroup title="Двигательная реакция (M)" options={MOTOR_OPTIONS} value={motor} setValue={setMotor} />

      {/* Рассчитать */}
      <Pressable
        onPress={calculateAndSave}
        style={{
          paddingVertical: 14,
          borderRadius: 12,
          backgroundColor: "#0b3d91",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>РАССЧИТАТЬ</Text>
      </Pressable>

      {/* Результат */}
      {result && (
        <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: "900" }}>Итог: {result.total}</Text>
          <Text style={{ lineHeight: 20 }}>{result.interpretation}</Text>
        </View>
      )}
    </ScrollView>
  );
}

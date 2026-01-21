import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { getAll, run } from "../db/database";
import { getCurrentUser } from "../utils/auth";

export default function HistoryScreen() {
  const [items, setItems] = useState([]);

  async function load() {
    const user = await getCurrentUser();
    if (!user) return setItems([]);
    const rows = getAll(
      "SELECT id, patient_name, eye, verbal, motor, total, interpretation, created_at FROM history WHERE user_id = ? ORDER BY id DESC",
      [user.id]
    );
    setItems(rows);
  }

  async function clearAll() {
    const user = await getCurrentUser();
    if (!user) return;
    run("DELETE FROM history WHERE user_id = ?", [user.id]);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Button title="Обновить" onPress={load} />
      <Button title="Очистить историю" onPress={clearAll} />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}>
            <Text style={{ fontWeight: "800" }}>ШКГ: {item.total}</Text>
            <Text style={{ fontWeight: "700" }}>Пациент: {item.patient_name || "—"}</Text>
            <Text>E={item.eye} V={item.verbal} M={item.motor}</Text>
            <Text>{item.interpretation}</Text>
            <Text style={{ opacity: 0.7 }}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 20, opacity: 0.7 }}>История пустая</Text>}
      />
    </View>
  );
}

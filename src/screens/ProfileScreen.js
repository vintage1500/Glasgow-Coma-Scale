import React, { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { getCurrentUser, logout } from "../utils/auth";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => setUser(await getCurrentUser()))();
  }, []);

  async function onLogout() {
    await logout();
    Alert.alert("Выход", "Вы вышли из аккаунта");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Профиль</Text>

      {user ? (
        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}>
          <Text><Text style={{ fontWeight: "700" }}>Имя:</Text> {user.name}</Text>
          <Text><Text style={{ fontWeight: "700" }}>Email:</Text> {user.email}</Text>
        </View>
      ) : (
        <Text style={{ opacity: 0.7 }}>Пользователь не найден</Text>
      )}

      <Button title="Выйти" onPress={onLogout} />
    </View>
  );
}

import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { login } from "../utils/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onLogin() {
    try {
      if (!email.trim() || !password) return Alert.alert("Ошибка", "Введите email и пароль");
      await login({ email, password });
      navigation.reset({ index: 0, routes: [{ name: "Calculator" }] });
    } catch (e) {
      Alert.alert("Ошибка", e.message || "Не удалось войти");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Вход</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />
      <TextInput
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      <Button title="Войти" onPress={onLogin} />
      <Button title="Нет аккаунта? Регистрация" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

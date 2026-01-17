import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { register } from "../utils/auth";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onRegister() {
    try {
      if (!name.trim() || !email.trim() || !password) return Alert.alert("Ошибка", "Заполните все поля");
      if (password.length < 6) return Alert.alert("Ошибка", "Пароль минимум 6 символов");
      await register({ name, email, password });
      navigation.reset({ index: 0, routes: [{ name: "Calculator" }] });
    } catch (e) {
      Alert.alert("Ошибка", e.message || "Не удалось зарегистрироваться");
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Регистрация</Text>

      <TextInput
        placeholder="Имя"
        placeholderTextColor="#000"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10, color: "#000" }}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#000"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10, color: "#000" }}
      />

      <TextInput
        placeholder="Пароль"
        placeholderTextColor="#000"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10, color: "#000" }}
      />

      <Button title="Создать аккаунт" onPress={onRegister} />
      <Button title="Уже есть аккаунт? Вход" onPress={() => navigation.goBack()} />
    </View>
  );
}

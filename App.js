import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initDb } from "./src/db/database.js";
import { getCurrentUser } from "./src/utils/auth";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CalculatorScreen from "./src/screens/CalculatorScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    (async () => {
      await initDb();
      const user = await getCurrentUser();
      setInitialRoute(user ? "Calculator" : "Login");
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Вход" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Регистрация" }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: "ШКГ — калькулятор" }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: "История" }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Профиль" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

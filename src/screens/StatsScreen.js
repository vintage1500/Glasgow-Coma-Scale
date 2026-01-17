import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

// Тема: кома / GCS. Можно менять запрос как хочешь.
const TERM = "glasgow coma scale coma";
const MAX_TITLES = 5;

// PubMed E-utilities (NCBI)
const ESEARCH_URL = (term) =>
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${MAX_TITLES}&sort=date&term=${encodeURIComponent(
    term
  )}`;

const ESUMMARY_URL = (ids) =>
  `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${encodeURIComponent(
    ids.join(",")
  )}`;

async function fetchWithTimeout(url, ms = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    console.log("[pubmed] request:", url);
    const res = await fetch(url, { signal: controller.signal });
    console.log("[pubmed] status:", res.status);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function safeInt(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

export default function StatsScreen() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [count, setCount] = useState(null);
  const [titles, setTitles] = useState([]);

  async function load() {
    setLoading(true);
    setErr("");
    setCount(null);
    setTitles([]);

    try {
      // 1) ESearch: получаем total count + список id последних статей
      const res1 = await fetchWithTimeout(ESEARCH_URL(TERM), 12000);
      if (!res1.ok) throw new Error(`ESearch HTTP ${res1.status}`);
      const json1 = await res1.json();

      const es = json1?.esearchresult;
      const c = safeInt(es?.count);
      const idlist = Array.isArray(es?.idlist) ? es.idlist : [];

      setCount(c);

      // Если ничего не нашли — ок, просто покажем count
      if (idlist.length === 0) {
        setLoading(false);
        return;
      }

      // 2) ESummary: подтягиваем заголовки по этим id
      const res2 = await fetchWithTimeout(ESUMMARY_URL(idlist), 12000);
      if (!res2.ok) throw new Error(`ESummary HTTP ${res2.status}`);
      const json2 = await res2.json();

      const result = json2?.result || {};
      const out = [];

      for (const id of idlist) {
        const item = result[id];
        if (item?.title) out.push(item.title);
      }

      setTitles(out);
    } catch (e) {
      const msg =
        e?.name === "AbortError"
          ? "Таймаут запроса к PubMed (нет ответа). Проверь интернет/режим запуска Expo."
          : e?.message || "Ошибка загрузки данных";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Статистика по теме (внешний API)</Text>

      <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}>
        <Text style={{ fontWeight: "800" }}>Источник: PubMed (NCBI E-utilities)</Text>
        <Text style={{ lineHeight: 20 }}>
          Запрос: <Text style={{ fontWeight: "800" }}>{TERM}</Text>
        </Text>
        <Text style={{ opacity: 0.75, lineHeight: 20 }}>
          Приложение делает HTTP-запрос к внешнему REST API, получает JSON и отображает статистику и
          последние публикации.
        </Text>
      </View>

      <Pressable
        onPress={load}
        style={{
          backgroundColor: "#1976d2",
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>ОБНОВИТЬ</Text>
      </Pressable>

      {loading ? (
        <View style={{ paddingTop: 20 }}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>Загрузка...</Text>
        </View>
      ) : null}

      {!loading && err ? (
        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ color: "#d32f2f", fontWeight: "800" }}>Ошибка</Text>
          <Text>{err}</Text>
        </View>
      ) : null}

      {!loading && !err ? (
        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 }}>
          <Text style={{ fontWeight: "900", fontSize: 16 }}>Результаты</Text>
          <Text>Всего публикаций по запросу: {count ?? "-"}</Text>

          <Text style={{ marginTop: 8, fontWeight: "800" }}>Последние статьи (top {MAX_TITLES})</Text>
          {titles.length === 0 ? (
            <Text>Нет данных для отображения</Text>
          ) : (
            titles.map((t, idx) => (
              <Text key={idx} style={{ lineHeight: 20 }}>
                {idx + 1}. {t}
              </Text>
            ))
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

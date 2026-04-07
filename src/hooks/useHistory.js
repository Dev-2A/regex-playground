import { useState, useCallback } from "react";

const STORAGE_KEY = "regex-playground-history";
const MAX_HISTORY = 30;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addToHistory = useCallback((pattern, flagString, testString) => {
    if (!pattern) return;

    setHistory((prev) => {
      // 동일한 패턴+플래그 조합이 이미 있으면 제거 후 맨 앞에 추가
      const filtered = prev.filter(
        (item) => !(item.pattern === pattern && item.flags === flagString),
      );
      const newItem = {
        id: Date.now(),
        pattern,
        flags: flagString,
        testString: testString.slice(0, 200), // 테스트 문자열은 200자까지만 저장
        timestamp: new Date().toISOString(),
      };
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

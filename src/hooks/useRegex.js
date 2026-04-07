import { useState, useMemo } from "react";
import { parseRegex } from "../utils/regexParser";

const DEFAULT_FLAGS = {
  g: true,
  i: false,
  m: false,
  s: false,
};

export function useRegex() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState(DEFAULT_FLAGS);
  const [testString, setTestString] = useState("");

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("");
  }, [flags]);

  const toggleFlag = (flag) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const regex = useMemo(() => {
    if (!pattern) return null;
    try {
      return new RegExp(pattern, flagString);
    } catch {
      return null;
    }
  }, [pattern, flagString]);

  const error = useMemo(() => {
    if (!pattern) return null;
    try {
      new RegExp(pattern, flagString);
      return null;
    } catch (e) {
      return e.message;
    }
  }, [pattern, flagString]);

  const { ast, error: parseError } = useMemo(
    () => parseRegex(pattern),
    [pattern],
  );

  return {
    pattern,
    setPattern,
    flags,
    flagString,
    toggleFlag,
    testString,
    setTestString,
    regex,
    error,
    ast,
    parseError,
  };
}

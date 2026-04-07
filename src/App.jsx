import { useState, useCallback, useEffect } from "react";
import Header from "./components/Layout/Header";
import PanelLayout from "./components/Layout/PanelLayout";
import RegexInput from "./components/Editor/RegexInput";
import TestStringInput from "./components/Editor/TestStringInput";
import ReplaceInput from "./components/Editor/ReplaceInput";
import MatchPanel from "./components/MatchInfo/MatchPanel";
import DiagramPanel from "./components/Visualizer/DiagramPanel";
import CheatSheetPanel from "./components/CheatSheet/CheatSheetPanel";
import HistoryPanel from "./components/History/HistoryPanel";
import { useRegex } from "./hooks/useRegex";
import { useHistory } from "./hooks/useHistory";
import { decodeFromUrl } from "./utils/shareUrl";

function App() {
  const {
    pattern,
    setPattern,
    flags,
    flagString,
    toggleFlag,
    setFlagsFromString,
    testString,
    setTestString,
    regex,
    error,
    ast,
    parseError,
  } = useRegex();

  const { history, addToHistory, removeFromHistory, clearHistory } =
    useHistory();

  const [replaceValue, setReplaceValue] = useState("");
  const [replaceVisible, setReplaceVisible] = useState(false);

  // URL에서 상태 복원 (최초 1회)
  useEffect(() => {
    const fromUrl = decodeFromUrl();
    if (fromUrl) {
      setPattern(fromUrl.pattern);
      if (fromUrl.flags) setFlagsFromString(fromUrl.flags);
      if (fromUrl.testString) setTestString(fromUrl.testString);
      if (fromUrl.replaceValue) {
        setReplaceValue(fromUrl.replaceValue);
        setReplaceVisible(true);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInsertPattern = useCallback(
    (syntax) => {
      setPattern((prev) => prev + syntax);
    },
    [setPattern],
  );

  const handleSave = useCallback(() => {
    addToHistory(pattern, flagString, testString);
  }, [addToHistory, pattern, flagString, testString]);

  const handleSelectHistory = useCallback(
    (item) => {
      setPattern(item.pattern);
      setFlagsFromString(item.flags);
      if (item.testString) {
        setTestString(item.testString);
      }
    },
    [setPattern, setFlagsFromString, setTestString],
  );

  const handleSelectPreset = useCallback(
    (preset) => {
      setPattern(preset.pattern);
      setFlagsFromString(preset.flags);
      setTestString(preset.testString);
      setReplaceValue("");
    },
    [setPattern, setFlagsFromString, setTestString],
  );

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      <Header
        onSelectPreset={handleSelectPreset}
        pattern={pattern}
        flagString={flagString}
        testString={testString}
        replaceValue={replaceValue}
      />
      <PanelLayout
        left={
          <>
            <RegexInput
              pattern={pattern}
              onPatternChange={setPattern}
              flags={flags}
              onToggleFlag={toggleFlag}
              error={error}
              onSave={handleSave}
            />
            <ReplaceInput
              replaceValue={replaceValue}
              onReplaceChange={setReplaceValue}
              regex={regex}
              testString={testString}
              visible={replaceVisible}
              onToggle={() => setReplaceVisible((v) => !v)}
            />
            <TestStringInput
              testString={testString}
              onTestStringChange={setTestString}
              regex={regex}
            />
            <MatchPanel regex={regex} testString={testString} />
          </>
        }
        right={
          <>
            <DiagramPanel ast={ast} parseError={parseError} />
            <CheatSheetPanel onInsertPattern={handleInsertPattern} />
          </>
        }
        bottom={
          <HistoryPanel
            history={history}
            onSelect={handleSelectHistory}
            onRemove={removeFromHistory}
            onClear={clearHistory}
          />
        }
      />
    </div>
  );
}

export default App;

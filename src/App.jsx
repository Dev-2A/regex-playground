import Header from "./components/Layout/Header";
import PanelLayout from "./components/Layout/PanelLayout";
import RegexInput from "./components/Editor/RegexInput";
import TestStringInput from "./components/Editor/TestStringInput";
import MatchPanel from "./components/MatchInfo/MatchPanel";
import DiagramPanel from "./components/Visualizer/DiagramPanel";
import CheatSheetPanel from "./components/CheatSheet/CheatSheetPanel";
import { useRegex } from "./hooks/useRegex";

function App() {
  const {
    pattern,
    setPattern,
    flags,
    toggleFlag,
    testString,
    setTestString,
    regex,
    error,
  } = useRegex();

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      <Header />
      <PanelLayout
        left={
          <>
            <RegexInput
              pattern={pattern}
              onPatternChange={setPattern}
              flags={flags}
              onToggleFlag={toggleFlag}
              error={error}
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
            <DiagramPanel />
            <CheatSheetPanel />
          </>
        }
      />
    </div>
  );
}

export default App;

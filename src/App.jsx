import Header from "./components/Layout/Header";
import PanelLayout from "./components/Layout/PanelLayout";
import RegexInput from "./components/Editor/RegexInput";
import TestStringInput from "./components/Editor/TestStringInput";
import MatchPanel from "./components/MatchInfo/MatchPanel";
import DiagramPanel from "./components/Visualizer/DiagramPanel";
import CheatSheetPanel from "./components/CheatSheet/CheatSheetPanel";

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100">
      <Header />
      <PanelLayout
        left={
          <>
            <RegexInput />
            <TestStringInput />
            <MatchPanel />
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

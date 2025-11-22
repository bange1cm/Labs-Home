import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import PlaygroundLayout from "./PlaygroundLayout";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Launch from "./pages/Launch";
import Download from "./pages/Download";
import HelpHome from "./pages/HelpHome";
import RestartAssignment from "./pages/RestartAssignment";
import ResetAll from "./pages/ResetAll";
import MoreHelp from "./pages/MoreHelp";
import WorkExplanation from "./pages/WorkExplanation";
import ActivityLog from "./pages/ActivityLog";
import Playground from "./pages/Playground";
import LaunchPlayground from "./pages/LaunchPlayground";
import ResetPlayground from "./pages/ResetPlayground";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Labs@Home Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/download" element={<Download />} />
          <Route path="/help" element={<HelpHome />} />
          <Route path="/restart-assignment" element={<RestartAssignment />} />
          <Route path="/reset-all" element={<ResetAll />} />
          <Route path="/more-help" element={<MoreHelp />} />
          <Route path="/work-explanation" element={<WorkExplanation />} />
          <Route path="/activity-log" element={<ActivityLog />} />
        </Route>

        {/* Playground Routes */}
        <Route element={<PlaygroundLayout />}>
          <Route path="/playground" element={<Playground />} />
          <Route path="/playground-launch" element={<LaunchPlayground />} />
          <Route path="/playground-reset" element={<ResetPlayground />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;

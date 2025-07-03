import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Color variables provided by user for theme
const COLOR_PRIMARY = "#dee3e7";
const COLOR_SECONDARY = "#b091fd";
const COLOR_ACCENT = "#afb1d9";

/*
Structure Overview:
1. Header + Title
2. Match Scenario Form
3. Scenario Display
4. Poll Question & Voting
5. Ticker
6. Responsive & Professional sports dashboard style, minimalistic and interactive
*/

// --- Utility functions ---

// PUBLIC_INTERFACE
async function fetchScenarioAndPoll(matchDetails) {
  /**
   * Mocks an API call that generates a cricket scenario and a yes/no poll question.
   * In production, this would call a backend endpoint that in turn uses OpenAI.
   */
  // Payload we would send to the real OpenAI backend
  // For demo, generate fake scenario and question based on input
  const { match, batter, bowler, overs, stage } = matchDetails;

  // Simulate loading time
  await new Promise((res) => setTimeout(res, 1000));

  // Very basic "scenario" logic for demonstration
  const scenario = `It's ${match}. Over: ${overs}. ${stage.charAt(0).toUpperCase() + stage.slice(1)} of the innings. ${batter} faces ${bowler}. What happens next?`;
  const pollQuestion = `Will ${batter} hit a boundary off ${bowler} in this over?`;

  return { scenario, pollQuestion };
}

// --- Main App Component ---
function App() {
  // FORM: match details state
  const [match, setMatch] = useState("");
  const [batter, setBatter] = useState("");
  const [bowler, setBowler] = useState("");
  const [overs, setOvers] = useState("");
  const [stage, setStage] = useState("mid"); // "start" | "mid" | "end"

  // Scenario & poll
  const [scenario, setScenario] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [scenarioLoading, setScenarioLoading] = useState(false);

  // Poll vote (Yes/No), tracking
  const [userVote, setUserVote] = useState(null);
  const [results, setResults] = useState({ yes: 0, no: 0 });
  const [hasVoted, setHasVoted] = useState(false);

  // Voting message/ticker
  const [tickerMessages, setTickerMessages] = useState([]);
  const tickerRef = useRef(null);

  // UI Modal states
  const [showScenario, setShowScenario] = useState(false);
  const [theme, setTheme] = useState("light");

  // Responsive layout: width state
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // --- Effects ---
  // Apply color theme on mount & toggle
  useEffect(() => {
    document.body.style.background = COLOR_PRIMARY;
    document.body.style.color = "#282c34";
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Handle window resize events
  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize, false);
    return () => window.removeEventListener("resize", handleResize, false);
  }, []);

  // Scroll ticker if length grows
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollLeft = tickerRef.current.scrollWidth;
    }
  }, [tickerMessages]);

  // --- Handlers ---

  // PUBLIC_INTERFACE
  function handleThemeToggle() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  // PUBLIC_INTERFACE
  function handleFormReset() {
    setMatch("");
    setBatter("");
    setBowler("");
    setOvers("");
    setStage("mid");
    setShowScenario(false);
    setScenario("");
    setPollQuestion("");
    setUserVote(null);
    setHasVoted(false);
    setResults({ yes: 0, no: 0 });
  }

  // PUBLIC_INTERFACE
  async function handleGenerateScenario(e) {
    e.preventDefault();
    setScenarioLoading(true);
    setShowScenario(false);
    setUserVote(null);
    setHasVoted(false);
    setResults({ yes: 0, no: 0 });
    setTickerMessages([
      ...tickerMessages,
      `🎬 Generating scenario for ${match}...`,
    ]);
    try {
      const { scenario, pollQuestion } = await fetchScenarioAndPoll({
        match,
        batter,
        bowler,
        overs,
        stage,
      });
      setScenario(scenario);
      setPollQuestion(pollQuestion);
      setShowScenario(true);
      setTickerMessages((msgs) => [
        ...msgs,
        `📢 Scenario ready: ${batter} vs ${bowler}`,
      ]);
    } catch (err) {
      setTickerMessages((msgs) => [
        ...msgs,
        "⚠️ Failed to generate scenario. Please try again.",
      ]);
    }
    setScenarioLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleVote(vote) {
    if (hasVoted) return;
    setResults((res) => {
      const newRes = { ...res };
      if (vote === "yes") newRes.yes += 1;
      else newRes.no += 1;
      return newRes;
    });
    setUserVote(vote);
    setHasVoted(true);
    setTickerMessages((msgs) => [
      ...msgs,
      `🗳️ Vote recorded: ${vote.toUpperCase()}`,
    ]);
  }

  // --- UI Components ---

  // PUBLIC_INTERFACE
  function MatchForm() {
    return (
      <form
        className="card match-form"
        onSubmit={handleGenerateScenario}
        aria-label="Match Details Input"
        style={{
          background: COLOR_PRIMARY,
          border: `1.5px solid ${COLOR_ACCENT}`,
          color: "#222",
          maxWidth: 420,
          margin: "0 auto",
          boxShadow: `0 2px 12px 0 ${COLOR_ACCENT}40`,
        }}
      >
        <h2 className="form-title" style={{ color: COLOR_SECONDARY }}>
          Cricket Match Input
        </h2>
        <div className="input-section">
          <label>
            Match Description
            <input
              type="text"
              required
              placeholder="e.g. Mumbai vs Chennai, IPL Final"
              value={match}
              onChange={(e) => setMatch(e.target.value)}
              data-testid="match-input"
              autoComplete="off"
              maxLength={64}
            />
          </label>
          <label>
            Batter Name
            <input
              type="text"
              required
              placeholder="e.g. V Kohli"
              value={batter}
              onChange={(e) => setBatter(e.target.value)}
              data-testid="batter-input"
              maxLength={32}
            />
          </label>
          <label>
            Bowler Name
            <input
              type="text"
              required
              placeholder="e.g. J Bumrah"
              value={bowler}
              onChange={(e) => setBowler(e.target.value)}
              data-testid="bowler-input"
              maxLength={32}
            />
          </label>
          <label>
            Overs
            <input
              type="text"
              required
              pattern="^\\d+(\\.\\d{0,1})?$"
              placeholder="e.g. 16.4"
              value={overs}
              onChange={(e) => setOvers(e.target.value)}
              data-testid="overs-input"
              maxLength={5}
              title="Enter overs (number, e.g. 16.4)"
            />
          </label>
          <label>
            Stage of Innings
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              data-testid="stage-select"
            >
              <option value="start">Start</option>
              <option value="mid">Mid</option>
              <option value="end">End</option>
            </select>
          </label>
        </div>
        <button
          type="submit"
          className="btn-main"
          style={{ background: COLOR_SECONDARY }}
          disabled={scenarioLoading}
        >
          {scenarioLoading ? "Generating..." : "Generate Scenario"}
        </button>
      </form>
    );
  }

  // PUBLIC_INTERFACE
  function ScenarioCard() {
    if (!showScenario) return null;
    return (
      <div
        className="card scenario-card"
        style={{
          marginTop: 36,
          marginBottom: 22,
          background: "#fff",
          border: `1.5px solid ${COLOR_ACCENT}`,
          color: "#111",
          maxWidth: 530,
          marginLeft: "auto",
          marginRight: "auto",
          boxShadow: `0 4px 24px 0 ${COLOR_ACCENT}30`,
        }}
        aria-live="polite"
      >
        <h3 style={{ color: COLOR_SECONDARY, marginBottom: 12 }}>
          Scenario
        </h3>
        <p style={{ fontWeight: 500, letterSpacing: 0.2 }}>{scenario}</p>
        <button
          className="btn-secondary"
          style={{
            background: "#fff",
            color: COLOR_SECONDARY,
            border: `1.3px solid ${COLOR_SECONDARY}`,
            marginTop: 12,
          }}
          onClick={handleFormReset}
        >
          Reset Scenario
        </button>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function PollCard() {
    if (!showScenario || !pollQuestion) return null;
    return (
      <div
        className="card poll-card"
        style={{
          background: "#f9faff",
          border: `1.2px solid ${COLOR_ACCENT}`,
          color: "#17181b",
          maxWidth: 450,
          margin: "24px auto",
          boxShadow: `0 1.5px 10px 0 ${COLOR_ACCENT}12`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h4 style={{ color: COLOR_ACCENT, margin: 0, marginBottom: 6 }}>
          Live Poll
        </h4>
        <div className="poll-question" style={{ margin: "8px 0" }}>
          <strong>{pollQuestion}</strong>
        </div>
        <div className="voting-buttons" style={{ gap: 18, display: "flex" }}>
          <button
            className={
              "btn-main" +
              (userVote === "yes" ? " selected" : "")
            }
            style={{
              background: userVote === "yes" ? COLOR_SECONDARY : COLOR_ACCENT,
              minWidth: 84,
            }}
            onClick={() => handleVote("yes")}
            disabled={hasVoted}
            aria-label="Vote Yes"
          >
            Yes
          </button>
          <button
            className={
              "btn-main" +
              (userVote === "no" ? " selected" : "")
            }
            style={{
              background: userVote === "no" ? COLOR_SECONDARY : COLOR_ACCENT,
              minWidth: 84,
            }}
            onClick={() => handleVote("no")}
            disabled={hasVoted}
            aria-label="Vote No"
          >
            No
          </button>
        </div>
        {hasVoted && (
          <div style={{ marginTop: 18, width: "85%" }}>
            <PollResults results={results} userVote={userVote} />
          </div>
        )}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function PollResults({ results, userVote }) {
    const total = results.yes + results.no;
    if (total === 0) return null;
    const yesPct = Math.round((results.yes / total) * 100);
    const noPct = 100 - yesPct;
    return (
      <div
        className="poll-results"
        style={{
          marginTop: 4,
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              color: "#11a511",
              fontWeight: userVote === "yes" ? 700 : 500,
            }}
          >
            Yes: {results.yes} ({yesPct}%)
          </span>
          <div
            style={{
              width: 60,
              background: "#ebede8",
              height: 6,
              borderRadius: 4,
              overflow: "hidden",
              margin: "0 8px",
              display: "flex",
            }}
          >
            <div
              style={{
                width: yesPct + "%",
                background: COLOR_SECONDARY,
                height: "100%",
                transition: "width .4s cubic-bezier(.4,2,.7,0.8)",
              }}
            ></div>
            <div
              style={{
                width: noPct + "%",
                background: COLOR_ACCENT,
                height: "100%",
                transition: "width .4s cubic-bezier(.4,2,.7,0.8)",
              }}
            ></div>
          </div>
          <span
            style={{
              color: "#b81d1d",
              fontWeight: userVote === "no" ? 700 : 500,
            }}
          >
            No: {results.no} ({noPct}%)
          </span>
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function Ticker() {
    // Only show if there are messages or if user voted
    if (!tickerMessages.length) return null;
    return (
      <div
        className="ticker-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          background: COLOR_SECONDARY,
          color: "#fff",
          fontWeight: 600,
          fontSize: viewportWidth < 700 ? 13 : 15,
          letterSpacing: 0.3,
          padding: "7px 0 5px 0",
          borderTop: `2.5px solid ${COLOR_ACCENT}`,
          boxShadow: `0 -1.5px 22px 0 ${COLOR_ACCENT}30`,
          zIndex: 1000,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
        role="status"
        ref={tickerRef}
        data-testid="ticker"
      >
        <span style={{ marginLeft: 24 }}>
          {tickerMessages.map((msg, idx) => (
            <span key={idx} style={{ marginRight: 30 }}>
              {msg}
            </span>
          ))}
        </span>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="App" style={{ background: COLOR_PRIMARY }}>
      {/* Theme Toggle Absolute */}
      <button
        className="theme-toggle"
        onClick={handleThemeToggle}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{
          background: COLOR_SECONDARY,
          color: "#fff",
        }}
        type="button"
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <header
        className="dashboard-header"
        style={{
          textAlign: "center",
          padding: "34px 10px 0 10px",
          marginBottom: 12,
        }}
      >
        <h1
          className="main-title"
          style={{
            fontWeight: 900,
            fontSize: viewportWidth < 450 ? 26 : 34,
            color: COLOR_SECONDARY,
            marginBottom: 3,
            textShadow: `0 2px 12px ${COLOR_ACCENT}35`,
            letterSpacing: "0.05em",
          }}
        >
          Cricket Scenario Poll Dashboard
        </h1>
        <div
          style={{
            fontWeight: 500,
            fontSize: viewportWidth < 450 ? 13 : 16,
            color: COLOR_ACCENT,
            margin: "0 auto 8px auto",
            maxWidth: 420,
          }}
        >
          Generate live, match-specific scenarios and interactive polling for cricket games — modern, minimal, & professional sports UI.
        </div>
      </header>
      <main style={{ minHeight: "68vh", paddingBottom: 60 }}>
        {/* 1. Match Input Form */}
        {!showScenario && <MatchForm />}
        {/* 2. Scenario Card */}
        <ScenarioCard />
        {/* 3. Poll */}
        <PollCard />
      </main>
      {/* 4. Ticker */}
      <Ticker />

      {/* Attribution hidden for minimalism */}
      {/* <footer style={{
        textAlign: "center",
        fontSize: "14px",
        color: "#888",
        marginTop: 12, marginBottom: 6,
      }}>
        Powered by OpenAI · Kavia sample
      </footer> */}
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0A0E1A",
  card: "#111827",
  card2: "#161D2E",
  accent: "#00D4AA",
  accent2: "#6C63FF",
  accent3: "#FF6B6B",
  gold: "#FFB547",
  text: "#F0F4FF",
  muted: "#8892A4",
  border: "#1E2A3A",
  green: "#22C55E",
  red: "#EF4444",
};

const mockAccounts = [
  { id: 1, name: "Chase Checking", type: "checking", balance: 12480.5, change: +240.3, icon: "🏦" },
  { id: 2, name: "Savings Account", type: "savings", balance: 34200.0, change: +85.0, icon: "💰" },
  { id: 3, name: "Credit Card", type: "credit", balance: -2340.8, change: -340.8, icon: "💳" },
];

const mockGoals = [
  { id: 1, name: "Emergency Fund", target: 20000, current: 14200, icon: "🛡️", color: COLORS.accent },
  { id: 2, name: "Dream Vacation", target: 5000, current: 3100, icon: "✈️", color: COLORS.accent2 },
  { id: 3, name: "New Laptop", target: 2500, current: 2100, icon: "💻", color: COLORS.gold },
  { id: 4, name: "Home Down Payment", target: 80000, current: 22000, icon: "🏠", color: COLORS.accent3 },
];

const mockCrypto = [
  { id: 1, name: "Bitcoin", symbol: "BTC", price: 67420, change: +3.24, holdings: 0.42, icon: "₿" },
  { id: 2, name: "Ethereum", symbol: "ETH", price: 3840, change: -1.12, holdings: 2.8, icon: "Ξ" },
  { id: 3, name: "Solana", symbol: "SOL", price: 182, change: +7.81, holdings: 14, icon: "◎" },
];

const mockStocks = [
  { id: 1, name: "Apple", symbol: "AAPL", price: 189.5, change: +1.24, shares: 10, icon: "🍎" },
  { id: 2, name: "NVIDIA", symbol: "NVDA", price: 875.3, change: +4.56, shares: 5, icon: "🟢" },
  { id: 3, name: "Tesla", symbol: "TSLA", price: 248.7, change: -2.3, shares: 8, icon: "⚡" },
];

const spendingData = [
  { month: "Oct", income: 6800, expense: 4100 },
  { month: "Nov", income: 7200, expense: 4800 },
  { month: "Dec", income: 7800, expense: 5600 },
  { month: "Jan", income: 6900, expense: 3900 },
  { month: "Feb", income: 7400, expense: 4200 },
  { month: "Mar", income: 8200, expense: 4600 },
];

const categories = [
  { name: "Housing", amount: 1800, pct: 39, color: COLORS.accent2, icon: "🏠" },
  { name: "Food", amount: 620, pct: 13, color: COLORS.accent, icon: "🍽️" },
  { name: "Transport", amount: 380, pct: 8, color: COLORS.gold, icon: "🚗" },
  { name: "Shopping", amount: 540, pct: 12, color: COLORS.accent3, icon: "🛍️" },
  { name: "Health", amount: 220, pct: 5, color: "#22C55E", icon: "💊" },
  { name: "Other", amount: 1040, pct: 23, color: "#8892A4", icon: "📦" },
];

const recentTx = [
  { id: 1, name: "Netflix", cat: "Entertainment", amount: -15.99, date: "Today", icon: "🎬" },
  { id: 2, name: "Salary", cat: "Income", amount: +4100.0, date: "Today", icon: "💼" },
  { id: 3, name: "Whole Foods", cat: "Groceries", amount: -87.43, date: "Yesterday", icon: "🛒" },
  { id: 4, name: "Uber", cat: "Transport", amount: -24.8, date: "Yesterday", icon: "🚗" },
  { id: 5, name: "Amazon", cat: "Shopping", amount: -129.99, date: "Mar 3", icon: "📦" },
];

function MiniChart({ data, color = COLORS.accent, filled = true }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const areaPath = `M${pts[0]} L${pts.slice(1).join(" L")} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 40 }}>
      {filled && (
        <path d={areaPath} fill={color} opacity="0.15" />
      )}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ data }) {
  const maxIncome = Math.max(...data.map(d => d.income));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ width: "100%", display: "flex", gap: 2, alignItems: "flex-end", height: 64 }}>
            <div style={{
              flex: 1, background: COLORS.accent, borderRadius: "3px 3px 0 0",
              height: `${(d.income / maxIncome) * 100}%`, opacity: 0.85
            }} />
            <div style={{
              flex: 1, background: COLORS.accent3, borderRadius: "3px 3px 0 0",
              height: `${(d.expense / maxIncome) * 100}%`, opacity: 0.85
            }} />
          </div>
          <span style={{ fontSize: 9, color: COLORS.muted }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function CircularScore({ score }) {
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? COLORS.green : score >= 60 ? COLORS.gold : COLORS.red;
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Fair";
  return (
    <div style={{ position: "relative", width: 128, height: 128 }}>
      <svg viewBox="0 0 128 128" style={{ width: 128, height: 128, transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.border} strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'DM Mono', monospace" }}>{score}</span>
        <span style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{label}</span>
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const size = 120, r = 46, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = data.map(d => {
    const len = (d.pct / 100) * circ;
    const s = { ...d, dash: len, offset };
    offset += len;
    return s;
  });
  return (
    <svg viewBox="0 0 120 120" style={{ width: size, height: size, transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.border} strokeWidth="16" />
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="16"
          strokeDasharray={`${s.dash - 1} ${circ - s.dash + 1}`}
          strokeDashoffset={-s.offset} />
      ))}
    </svg>
  );
}

function Pill({ color, label }) {
  return (
    <span style={{
      background: color + "22", color, borderRadius: 99, padding: "2px 10px",
      fontSize: 11, fontWeight: 700, border: `1px solid ${color}44`
    }}>{label}</span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 20, padding: 20,
      border: `1px solid ${COLORS.border}`, ...style
    }}>{children}</div>
  );
}

const NAV = [
  { id: "dashboard", icon: "⊞", label: "Home" },
  { id: "accounts", icon: "🏦", label: "Accounts" },
  { id: "goals", icon: "🎯", label: "Goals" },
  { id: "portfolio", icon: "📈", label: "Portfolio" },
  { id: "spending", icon: "📊", label: "Spending" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [healthScore] = useState(82);
  const [addGoalModal, setAddGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", target: "", current: "", icon: "🎯" });
  const [goals, setGoals] = useState(mockGoals);
  const [portfolioTab, setPortfolioTab] = useState("crypto");
  const [loaded, setLoaded] = useState(false);
  const [quickModal, setQuickModal] = useState(false);
  const [quickType, setQuickType] = useState("expense"); // "expense" | "income"
  const [quickForm, setQuickForm] = useState({ amount: "", name: "", category: "", note: "" });
  const [transactions, setTransactions] = useState(recentTx);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const expenseCategories = ["🍽️ Food", "🚗 Transport", "🛍️ Shopping", "🏠 Housing", "💊 Health", "🎬 Entertainment", "📦 Other"];
  const incomeCategories = ["💼 Salary", "💸 Freelance", "📈 Investment", "🎁 Gift", "🏦 Transfer", "📦 Other"];

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const totalBalance = mockAccounts.reduce((s, a) => s + a.balance, 0);
  const cryptoValue = mockCrypto.reduce((s, c) => s + c.price * c.holdings, 0);
  const stockValue = mockStocks.reduce((s, s2) => s + s2.price * s2.shares, 0);
  const netWorth = totalBalance + cryptoValue + stockValue;

  const chartData = [42000, 44500, 43100, 47800, 46200, 50400, 52100, 54800, 53200, 56900, 58400, 61200];

  const wrapStyle = {
    fontFamily: "'DM Sans', 'Nunito', sans-serif",
    background: COLORS.bg,
    minHeight: "100vh",
    color: COLORS.text,
    maxWidth: 430,
    margin: "0 auto",
    position: "relative",
    paddingBottom: 80,
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.4s ease",
  };

  return (
    <div style={wrapStyle}>
      {/* Top bar */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: COLORS.muted }}>Good morning 👋</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>Alex Johnson</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, cursor: "pointer", boxShadow: `0 4px 20px ${COLORS.accent2}44`
        }}>AJ</div>
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Net Worth Hero */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.accent2}dd, ${COLORS.accent}cc)`,
            borderRadius: 24, padding: 24, position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
            <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>Total Net Worth</div>
            <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-1.5px", color: "#fff" }}>
              ${netWorth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Cash</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>${totalBalance.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Crypto</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>${cryptoValue.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Stocks</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>${stockValue.toLocaleString()}</div>
              </div>
            </div>
            <div style={{ marginTop: 14, height: 50 }}>
              <MiniChart data={chartData} color="#fff" filled />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>12 months</span>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>▲ +12.4% YTD</span>
            </div>
          </div>

          {/* Health Score + Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16 }}>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12, alignSelf: "flex-start" }}>Health Score</div>
              <CircularScore score={healthScore} />
              <div style={{ marginTop: 10, fontSize: 11, color: COLORS.muted, textAlign: "center" }}>
                Top 15% of users
              </div>
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Card style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Monthly Income</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.green, marginTop: 2 }}>$8,200</div>
                <div style={{ fontSize: 11, color: COLORS.green }}>▲ +10.8%</div>
              </Card>
              <Card style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Monthly Spend</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent3, marginTop: 2 }}>$4,600</div>
                <div style={{ fontSize: 11, color: COLORS.accent3 }}>▲ +9.5%</div>
              </Card>
              <Card style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Savings Rate</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, marginTop: 2 }}>44%</div>
                <div style={{ fontSize: 11, color: COLORS.accent }}>Great pace 🎉</div>
              </Card>
            </div>
          </div>

          {/* Recent Transactions */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Recent Transactions</div>
              <span style={{ fontSize: 12, color: COLORS.accent, cursor: "pointer" }}>See all →</span>
            </div>
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: COLORS.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{tx.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tx.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted }}>{tx.cat} · {tx.date}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: tx.amount > 0 ? COLORS.green : COLORS.text }}>
                  {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                </div>
              </div>
            ))}
            ))}
          </Card>

          {/* Budget Bar */}
          <Card>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Monthly Budget</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 14 }}>$4,600 of $6,000 used</div>
            <div style={{ background: COLORS.border, borderRadius: 99, height: 10, overflow: "hidden" }}>
              <div style={{ width: "76%", height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2})`, transition: "width 1s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: COLORS.muted }}>
              <span>76% used</span>
              <span>$1,400 remaining</span>
            </div>
          </Card>
        </div>
      )}

      {/* ACCOUNTS */}
      {tab === "accounts" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, padding: "8px 4px" }}>My Accounts</div>
          {mockAccounts.map(acc => (
            <Card key={acc.id} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: COLORS.card2, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{acc.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{acc.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, textTransform: "capitalize" }}>{acc.type}</div>
                </div>
                <Pill color={acc.change >= 0 ? COLORS.green : COLORS.red} label={`${acc.change >= 0 ? "+" : ""}$${Math.abs(acc.change).toFixed(2)}`} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: acc.balance < 0 ? COLORS.red : COLORS.text, letterSpacing: "-1px" }}>
                {acc.balance < 0 ? "-" : ""}${Math.abs(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div style={{ marginTop: 12 }}>
                <MiniChart data={[1, 2, 1.5, 3, 2.8, 4, 3.5, 5, 4.2, 4.8].map(v => v + Math.random())} color={acc.balance < 0 ? COLORS.red : COLORS.accent} />
              </div>
            </Card>
          ))}
          <button style={{
            background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent})`,
            border: "none", borderRadius: 16, padding: "16px", color: "#fff", fontWeight: 700,
            fontSize: 15, cursor: "pointer", width: "100%"
          }}>+ Link New Account</button>
        </div>
      )}

      {/* GOALS */}
      {tab === "goals" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 4px" }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>Goals</div>
            <button onClick={() => setAddGoalModal(true)} style={{
              background: COLORS.accent, border: "none", borderRadius: 12, padding: "8px 16px",
              color: "#0A0E1A", fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}>+ New Goal</button>
          </div>
          {goals.map(g => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            const remaining = g.target - g.current;
            return (
              <Card key={g.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 28 }}>{g.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>Target: ${g.target.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: g.color }}>{pct}%</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>complete</div>
                  </div>
                </div>
                <div style={{ background: COLORS.border, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: g.color, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted }}>
                  <span style={{ color: g.color, fontWeight: 600 }}>${g.current.toLocaleString()} saved</span>
                  <span>${remaining.toLocaleString()} to go</span>
                </div>
              </Card>
            );
          })}
          {addGoalModal && (
            <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100,
              display: "flex", alignItems: "flex-end", justifyContent: "center"
            }} onClick={() => setAddGoalModal(false)}>
              <div style={{ background: COLORS.card, borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430 }}
                onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>New Goal</div>
                {[
                  { label: "Goal Name", key: "name", placeholder: "e.g. New Car" },
                  { label: "Target Amount ($)", key: "target", placeholder: "5000" },
                  { label: "Current Savings ($)", key: "current", placeholder: "0" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>{f.label}</div>
                    <input
                      value={newGoal[f.key]}
                      onChange={e => setNewGoal(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: "100%", background: COLORS.card2, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 14px", color: COLORS.text, fontSize: 15, boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <button onClick={() => {
                  if (newGoal.name && newGoal.target) {
                    const icons = ["🎯", "🚀", "💎", "🌟", "🏆", "🎸"];
                    setGoals(g => [...g, { id: Date.now(), name: newGoal.name, target: +newGoal.target, current: +newGoal.current || 0, icon: icons[Math.floor(Math.random() * icons.length)], color: COLORS.accent }]);
                    setNewGoal({ name: "", target: "", current: "", icon: "🎯" });
                    setAddGoalModal(false);
                  }
                }} style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent})`, border: "none", borderRadius: 14, padding: 16, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 6 }}>
                  Create Goal
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PORTFOLIO */}
      {tab === "portfolio" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, padding: "8px 4px" }}>Portfolio</div>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: COLORS.muted }}>Total Portfolio Value</div>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px", margin: "8px 0" }}>${(cryptoValue + stockValue).toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
            <Pill color={COLORS.green} label="▲ +18.4% All Time" />
            <div style={{ marginTop: 16 }}>
              <MiniChart data={[28000, 31000, 29500, 35000, 33200, 38000, 42000, 40000, 45000, 48000, 47000, (cryptoValue + stockValue)]} color={COLORS.accent} />
            </div>
          </Card>

          <div style={{ display: "flex", gap: 8 }}>
            {["crypto", "stocks"].map(t => (
              <button key={t} onClick={() => setPortfolioTab(t)} style={{
                flex: 1, padding: "12px", borderRadius: 14, border: "none", cursor: "pointer",
                background: portfolioTab === t ? COLORS.accent : COLORS.card,
                color: portfolioTab === t ? "#0A0E1A" : COLORS.muted,
                fontWeight: 700, fontSize: 14, textTransform: "capitalize"
              }}>{t === "crypto" ? "🪙 Crypto" : "📈 Stocks"}</button>
            ))}
          </div>

          {portfolioTab === "crypto" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockCrypto.map(c => (
                <Card key={c.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: COLORS.card2, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{c.symbol} · {c.holdings} held</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>${(c.price * c.holdings).toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                      <div style={{ fontSize: 12, color: c.change >= 0 ? COLORS.green : COLORS.red, fontWeight: 600 }}>
                        {c.change >= 0 ? "▲" : "▼"} {Math.abs(c.change)}%
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <MiniChart data={Array.from({ length: 12 }, () => c.price * (0.85 + Math.random() * 0.3))} color={c.change >= 0 ? COLORS.green : COLORS.red} />
                  </div>
                </Card>
              ))}
            </div>
          )}
          {portfolioTab === "stocks" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockStocks.map(s => (
                <Card key={s.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: COLORS.card2, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{s.symbol} · {s.shares} shares</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>${(s.price * s.shares).toLocaleString("en-US", { maximumFractionDigits: 0 })}</div>
                      <div style={{ fontSize: 12, color: s.change >= 0 ? COLORS.green : COLORS.red, fontWeight: 600 }}>
                        {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change)}%
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <MiniChart data={Array.from({ length: 12 }, () => s.price * (0.88 + Math.random() * 0.24))} color={s.change >= 0 ? COLORS.green : COLORS.red} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SPENDING */}
      {tab === "spending" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, padding: "8px 4px" }}>Spending</div>

          <Card>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Income vs Expenses</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>Last 6 months</div>
            <BarChart data={spendingData} />
            <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.accent }} />
                <span style={{ fontSize: 12, color: COLORS.muted }}>Income</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS.accent3 }} />
                <span style={{ fontSize: 12, color: COLORS.muted }}>Expenses</span>
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Spending by Category</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <DonutChart data={categories} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.slice(0, 4).map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: COLORS.muted, flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            {categories.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 20 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ background: COLORS.border, borderRadius: 99, height: 4, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: `${c.pct}%`, height: "100%", borderRadius: 99, background: c.color }} />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>${c.amount}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: COLORS.card, borderTop: `1px solid ${COLORS.border}`,
        display: "flex", padding: "10px 0 16px", alignItems: "center",
      }}>
        {NAV.slice(0, 2).map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: tab === n.id ? COLORS.accent : COLORS.muted, transition: "color 0.2s",
          }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === n.id ? 700 : 400 }}>{n.label}</span>
          </button>
        ))}
        {/* Center FAB */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button onClick={() => { setQuickModal(true); setQuickType("expense"); setQuickForm({ amount: "", name: "", category: "", note: "" }); setQuickSuccess(false); }} style={{
            width: 58, height: 58, borderRadius: "50%", border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent})`,
            boxShadow: `0 4px 24px ${COLORS.accent}66, 0 0 0 4px ${COLORS.card}`,
            fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 300, marginTop: -28,
            transition: "transform 0.15s ease",
          }}>＋</button>
        </div>
        {NAV.slice(2).map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            flex: 1, background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: tab === n.id ? COLORS.accent : COLORS.muted, transition: "color 0.2s",
          }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === n.id ? 700 : 400 }}>{n.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Entry Modal */}
      {quickModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }} onClick={() => setQuickModal(false)}>
          <div style={{
            background: COLORS.card, borderRadius: "28px 28px 0 0", padding: "24px 20px 36px",
            width: "100%", maxWidth: 430, border: `1px solid ${COLORS.border}`,
            boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
          }} onClick={e => e.stopPropagation()}>

            {quickSuccess ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{quickType === "income" ? "💚" : "✅"}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Entry Added!</div>
                <div style={{ fontSize: 14, color: COLORS.muted }}>
                  {quickType === "income" ? "+" : "-"}${parseFloat(quickForm.amount || 0).toFixed(2)} · {quickForm.name || "Transaction"}
                </div>
                <button onClick={() => setQuickModal(false)} style={{
                  marginTop: 24, background: COLORS.accent, border: "none", borderRadius: 14,
                  padding: "14px 40px", color: "#0A0E1A", fontWeight: 700, fontSize: 15, cursor: "pointer"
                }}>Done</button>
              </div>
            ) : (
              <>
                {/* Drag handle */}
                <div style={{ width: 40, height: 4, borderRadius: 99, background: COLORS.border, margin: "0 auto 20px" }} />

                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, textAlign: "center" }}>Quick Entry</div>

                {/* Type toggle */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24, background: COLORS.card2, borderRadius: 16, padding: 4 }}>
                  {["expense", "income"].map(t => (
                    <button key={t} onClick={() => setQuickType(t)} style={{
                      flex: 1, padding: "12px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: quickType === t ? (t === "income" ? COLORS.green : COLORS.accent3) : "transparent",
                      color: quickType === t ? "#fff" : COLORS.muted,
                      fontWeight: 700, fontSize: 14, transition: "all 0.2s",
                    }}>
                      {t === "expense" ? "💸 Expense" : "💰 Income"}
                    </button>
                  ))}
                </div>

                {/* Amount big input */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>Amount</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 300, color: COLORS.muted }}>$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={quickForm.amount}
                      onChange={e => setQuickForm(p => ({ ...p, amount: e.target.value }))}
                      style={{
                        background: "transparent", border: "none", outline: "none",
                        fontSize: 48, fontWeight: 900, color: quickType === "income" ? COLORS.green : COLORS.accent3,
                        width: 200, textAlign: "center", letterSpacing: "-2px",
                      }}
                    />
                  </div>
                  <div style={{ width: "80%", height: 2, background: COLORS.border, margin: "8px auto 0", borderRadius: 99 }} />
                </div>

                {/* Description */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Description</div>
                  <input
                    placeholder={quickType === "income" ? "e.g. Freelance payment" : "e.g. Grocery run"}
                    value={quickForm.name}
                    onChange={e => setQuickForm(p => ({ ...p, name: e.target.value }))}
                    style={{
                      width: "100%", background: COLORS.card2, border: `1px solid ${COLORS.border}`,
                      borderRadius: 12, padding: "12px 14px", color: COLORS.text, fontSize: 15,
                      boxSizing: "border-box", outline: "none",
                    }}
                  />
                </div>

                {/* Category chips */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>Category</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(quickType === "expense" ? expenseCategories : incomeCategories).map(cat => (
                      <button key={cat} onClick={() => setQuickForm(p => ({ ...p, category: cat }))} style={{
                        padding: "7px 14px", borderRadius: 99, border: `1px solid ${quickForm.category === cat ? (quickType === "income" ? COLORS.green : COLORS.accent3) : COLORS.border}`,
                        background: quickForm.category === cat ? (quickType === "income" ? COLORS.green + "22" : COLORS.accent3 + "22") : COLORS.card2,
                        color: quickForm.category === cat ? (quickType === "income" ? COLORS.green : COLORS.accent3) : COLORS.muted,
                        fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                      }}>{cat}</button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Note (optional)</div>
                  <input
                    placeholder="Add a note..."
                    value={quickForm.note}
                    onChange={e => setQuickForm(p => ({ ...p, note: e.target.value }))}
                    style={{
                      width: "100%", background: COLORS.card2, border: `1px solid ${COLORS.border}`,
                      borderRadius: 12, padding: "12px 14px", color: COLORS.text, fontSize: 14,
                      boxSizing: "border-box", outline: "none",
                    }}
                  />
                </div>

                <button
                  disabled={!quickForm.amount || parseFloat(quickForm.amount) <= 0}
                  onClick={() => {
                    const amt = parseFloat(quickForm.amount);
                    const catIcon = (quickForm.category || "📦 Other").split(" ")[0];
                    const catName = (quickForm.category || "📦 Other").split(" ").slice(1).join(" ") || "Other";
                    const newTx = {
                      id: Date.now(),
                      name: quickForm.name || catName,
                      cat: catName,
                      amount: quickType === "income" ? amt : -amt,
                      date: "Just now",
                      icon: catIcon,
                    };
                    setTransactions(prev => [newTx, ...prev]);
                    setQuickSuccess(true);
                  }}
                  style={{
                    width: "100%", border: "none", borderRadius: 16, padding: "16px",
                    background: (!quickForm.amount || parseFloat(quickForm.amount) <= 0)
                      ? COLORS.border
                      : `linear-gradient(135deg, ${quickType === "income" ? "#16a34a, #22c55e" : COLORS.accent2 + ", " + COLORS.accent3})`,
                    color: (!quickForm.amount || parseFloat(quickForm.amount) <= 0) ? COLORS.muted : "#fff",
                    fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "all 0.2s",
                  }}>
                  {quickType === "income" ? "💰 Add Income" : "💸 Add Expense"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

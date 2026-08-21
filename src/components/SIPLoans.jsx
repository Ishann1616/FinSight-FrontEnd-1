import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const ROLEX_GREEN = "#006039";
const APPLE_BLUE = "#0071E3";

function getToken() {
  return localStorage.getItem("token");
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export default function SIPLoans() {
  const [tab, setTab] = useState("sip");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1
        className="text-2xl mb-6"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: ROLEX_GREEN }}
      >
        SIP & Loans
      </h1>

      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {["sip", "loans"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
            style={tab === t ? { borderColor: ROLEX_GREEN } : {}}
          >
            {t === "sip" ? "SIP Plans" : "Loans"}
          </button>
        ))}
      </div>

      {tab === "sip" ? <SIPSection /> : <LoansSection />}
    </div>
  );
}

/* ---------------- SIP SECTION ---------------- */

function SIPSection() {
  const [sips, setSips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fund_name: "",
    amount: "",
    due_date: "",
    frequency: "monthly",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadSips = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/sip/");
      setSips(data);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSips();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fund_name || !form.amount || !form.due_date) {
      setError("Fill in fund name, amount, and due date.");
      return;
    }
    const dueDateNum = Number(form.due_date);
    if (dueDateNum < 1 || dueDateNum > 31) {
      setError("Due date must be between 1 and 31.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/sip/", {
        method: "POST",
        body: JSON.stringify({
          fund_name: form.fund_name,
          amount: Number(form.amount),
          due_date: dueDateNum,
          frequency: form.frequency,
          status: form.status,
        }),
      });
      setForm({ fund_name: "", amount: "", due_date: "", frequency: "monthly", status: "active" });
      await loadSips();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/sip/${id}`, { method: "DELETE" });
      setSips((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Fund name"
          value={form.fund_name}
          onChange={(e) => setForm({ ...form, fund_name: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-2"
        />
        <input
          type="number"
          placeholder="Monthly amount (₹)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Due date (1-31)"
          min="1"
          max="31"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="col-span-2 text-white text-sm font-medium rounded-lg py-2 disabled:opacity-50"
          style={{ backgroundColor: APPLE_BLUE }}
        >
          {submitting ? "Adding..." : "Add SIP"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : sips.length === 0 ? (
        <p className="text-gray-400 text-sm">No SIP plans yet.</p>
      ) : (
        <div className="space-y-3">
          {sips.map((sip) => (
            <div
              key={sip.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{sip.fund_name}</p>
                <p className="text-sm text-gray-500">
                  ₹{sip.amount.toLocaleString("en-IN")} · {sip.frequency} · due {sip.due_date}
                  {getOrdinalSuffix(sip.due_date)} ·{" "}
                  <span
                    className={sip.status === "active" ? "text-emerald-600" : "text-gray-400"}
                  >
                    {sip.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(sip.id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- LOANS SECTION ---------------- */

function LoansSection() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    loan_type: "",
    principal: "",
    annual_rate: "",
    tenure_months: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadLoans = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/loans/");
      setLoans(data);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.loan_type || !form.principal || !form.annual_rate || !form.tenure_months) {
      setError("Fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch("/loans/", {
        method: "POST",
        body: JSON.stringify({
          loan_type: form.loan_type,
          principal: Number(form.principal),
          annual_rate: Number(form.annual_rate),
          tenure_months: Number(form.tenure_months),
          status: form.status,
        }),
      });
      setForm({ loan_type: "", principal: "", annual_rate: "", tenure_months: "", status: "active" });
      await loadLoans();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/loans/${id}`, { method: "DELETE" });
      setLoans((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Loan type (e.g. Home, Car, Personal)"
          value={form.loan_type}
          onChange={(e) => setForm({ ...form, loan_type: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-2"
        />
        <input
          type="number"
          placeholder="Principal (₹)"
          value={form.principal}
          onChange={(e) => setForm({ ...form, principal: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Annual interest rate (%)"
          value={form.annual_rate}
          onChange={(e) => setForm({ ...form, annual_rate: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="number"
          placeholder="Tenure (months)"
          value={form.tenure_months}
          onChange={(e) => setForm({ ...form, tenure_months: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
        {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="col-span-2 text-white text-sm font-medium rounded-lg py-2 disabled:opacity-50"
          style={{ backgroundColor: APPLE_BLUE }}
        >
          {submitting ? "Adding..." : "Add Loan"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : loans.length === 0 ? (
        <p className="text-gray-400 text-sm">No loans yet.</p>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => {
            const emi = loan.emi_details || {};
            const emiAmount = emi.emi ?? emi.monthly_emi ?? null;
            return (
              <div
                key={loan.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-900">{loan.loan_type}</p>
                  <p className="text-sm text-gray-500">
                    ₹{loan.principal.toLocaleString("en-IN")} · {loan.annual_rate}% ·{" "}
                    {loan.tenure_months} months ·{" "}
                    <span
                      className={loan.status === "active" ? "text-emerald-600" : "text-gray-400"}
                    >
                      {loan.status}
                    </span>
                  </p>
                  {emiAmount !== null && (
                    <p className="text-sm mt-1" style={{ color: ROLEX_GREEN }}>
                      EMI: ₹{Number(emiAmount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}/mo
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(loan.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getOrdinalSuffix(n) {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

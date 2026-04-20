import { useState } from 'react';
import Layout from '../../components/Layout';

const fmt = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const inputStyle = {
  padding: '0.45rem 0.6rem',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
};

const sectionStyle = {
  background: '#f9f9f9',
  padding: '1.25rem',
  borderRadius: 10,
  border: '1px solid #e0e0e0',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '0.75rem',
};

const tdBase = {
  padding: '0.55rem 0.75rem',
  borderBottom: '1px solid #eee',
};

const EMPTY_DEBT = { name: '', balance: '', rate: '', minPayment: '' };

function simulatePayoff(debts, extra, order) {
  // Deep copy
  let remaining = debts
    .filter((d) => d.b > 0 && d.min > 0)
    .map((d) => ({ ...d }))
    .sort(order);

  if (remaining.length === 0) return { months: 0, totalInterest: 0, schedule: [] };

  let totalInterest = 0;
  let months = 0;
  const MAX_MONTHS = 600;

  while (remaining.some((d) => d.b > 0) && months < MAX_MONTHS) {
    months++;
    // Apply interest and minimums
    let extraLeft = extra;
    for (const d of remaining) {
      if (d.b <= 0) continue;
      const interest = d.b * (d.r / 12);
      totalInterest += interest;
      d.b += interest;
      const payment = Math.min(d.b, d.min);
      d.b -= payment;
    }
    // Apply extra to first unpaid debt in order
    for (const d of remaining) {
      if (d.b <= 0 || extraLeft <= 0) continue;
      const applied = Math.min(d.b, extraLeft);
      d.b -= applied;
      extraLeft -= applied;
    }
    remaining = remaining.filter((d) => d.b > 0);
  }

  return { months, totalInterest };
}

export default function DebtPayoff() {
  const [debts, setDebts] = useState([
    { name: 'Credit Card', balance: '8000', rate: '22', minPayment: '200' },
    { name: 'Car Loan', balance: '12000', rate: '6', minPayment: '250' },
    { name: 'Student Loan', balance: '20000', rate: '5.5', minPayment: '220' },
  ]);
  const [extraPayment, setExtraPayment] = useState('200');

  const setDebt = (i, field, val) => {
    const next = debts.map((d, idx) => (idx === i ? { ...d, [field]: val } : d));
    setDebts(next);
  };

  const addDebt = () => {
    if (debts.length < 6) setDebts([...debts, { ...EMPTY_DEBT }]);
  };

  const removeDebt = (i) => {
    setDebts(debts.filter((_, idx) => idx !== i));
  };

  const extra = Math.max(0, parseFloat(extraPayment) || 0);

  const parsedDebts = debts.map((d) => ({
    name: d.name || `Debt`,
    b: Math.max(0, parseFloat(d.balance) || 0),
    r: (parseFloat(d.rate) || 0) / 100,
    min: Math.max(0, parseFloat(d.minPayment) || 0),
  }));

  const totalBalance = parsedDebts.reduce((a, d) => a + d.b, 0);
  const totalMinPayment = parsedDebts.reduce((a, d) => a + d.min, 0);

  // Avalanche: highest interest rate first
  const avalanche = simulatePayoff(
    parsedDebts,
    extra,
    (a, b) => b.r - a.r
  );
  // Snowball: lowest balance first
  const snowball = simulatePayoff(
    parsedDebts,
    extra,
    (a, b) => a.b - b.b
  );

  const avalancheOrder = [...parsedDebts]
    .filter((d) => d.b > 0)
    .sort((a, b) => b.r - a.r);
  const snowballOrder = [...parsedDebts]
    .filter((d) => d.b > 0)
    .sort((a, b) => a.b - b.b);

  return (
    <Layout title="Debt Payoff Optimizer">
      <h1 style={{ marginBottom: '0.25rem' }}>Debt Payoff Optimizer</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Compare the Avalanche (highest interest first) and Snowball (lowest balance first) methods
        to find the fastest and cheapest path to debt freedom.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Your Debts</h2>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {debts.map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '0.5rem',
                  alignItems: 'end',
                }}
              >
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {i === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>
                      Name
                    </span>
                  )}
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => setDebt(i, 'name', e.target.value)}
                    placeholder="Debt name"
                    style={inputStyle}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {i === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>
                      Balance ($)
                    </span>
                  )}
                  <input
                    type="number"
                    value={d.balance}
                    min="0"
                    onChange={(e) => setDebt(i, 'balance', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {i === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>
                      Rate (%)
                    </span>
                  )}
                  <input
                    type="number"
                    value={d.rate}
                    min="0"
                    step="0.1"
                    onChange={(e) => setDebt(i, 'rate', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {i === 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600 }}>
                      Min. Payment ($)
                    </span>
                  )}
                  <input
                    type="number"
                    value={d.minPayment}
                    min="0"
                    onChange={(e) => setDebt(i, 'minPayment', e.target.value)}
                    style={inputStyle}
                  />
                </label>
                <button
                  onClick={() => removeDebt(i)}
                  style={{
                    padding: '0.45rem 0.7rem',
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    background: '#fff',
                    cursor: 'pointer',
                    color: '#c0392b',
                    fontSize: '0.9rem',
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {debts.length < 6 && (
            <button
              onClick={addDebt}
              style={{
                marginTop: '0.75rem',
                padding: '0.45rem 1rem',
                border: '1px solid #ccc',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              + Add debt
            </button>
          )}

          <div style={{ marginTop: '1rem', maxWidth: 240 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
                Extra monthly payment toward debt ($)
              </span>
              <input
                type="number"
                value={extraPayment}
                min="0"
                onChange={(e) => setExtraPayment(e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Results</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'left',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Metric
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Avalanche
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Snowball
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Total debt</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalBalance)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalBalance)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly payment (minimums + extra)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalMinPayment + extra)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalMinPayment + extra)}</td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>Total interest paid</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color:
                        avalanche.totalInterest <= snowball.totalInterest ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(avalanche.totalInterest)}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color:
                        snowball.totalInterest <= avalanche.totalInterest ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(snowball.totalInterest)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>Months to debt-free</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color:
                        avalanche.months <= snowball.months ? '#27ae60' : undefined,
                    }}
                  >
                    {avalanche.months} mo ({(avalanche.months / 12).toFixed(1)} yrs)
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color:
                        snowball.months <= avalanche.months ? '#27ae60' : undefined,
                    }}
                  >
                    {snowball.months} mo ({(snowball.months / 12).toFixed(1)} yrs)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div style={sectionStyle}>
              <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>
                Avalanche Payoff Order
              </h3>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {avalancheOrder.map((d) => (
                  <li key={d.name}>
                    <strong>{d.name}</strong> — {fmt(d.b)} @ {(d.r * 100).toFixed(1)}%
                  </li>
                ))}
              </ol>
            </div>
            <div style={sectionStyle}>
              <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>
                Snowball Payoff Order
              </h3>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
                {snowballOrder.map((d) => (
                  <li key={d.name}>
                    <strong>{d.name}</strong> — {fmt(d.b)} @ {(d.r * 100).toFixed(1)}%
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Avalanche minimizes total interest paid. Snowball provides quicker psychological wins
            by eliminating smaller balances first. Both assume extra payments are applied after all
            minimums are paid each month.
          </p>
        </section>
      </div>
    </Layout>
  );
}

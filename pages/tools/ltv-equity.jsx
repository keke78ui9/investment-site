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
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '1rem',
};

const tdBase = {
  padding: '0.55rem 0.75rem',
  borderBottom: '1px solid #eee',
};

function Field({ label, value, onChange, step = '1', min }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

export default function LTVEquityTracker() {
  const [propertyValue, setPropertyValue] = useState('400000');
  const [loanAmount, setLoanAmount] = useState('320000');
  const [interestRate, setInterestRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');
  const [appreciationRate, setAppreciationRate] = useState('3');

  const origValue = Math.max(0, parseFloat(propertyValue) || 0);
  const origLoan = Math.max(0, parseFloat(loanAmount) || 0);
  const r = (parseFloat(interestRate) || 0) / 100 / 12;
  const termMonths = Math.max(1, (parseFloat(loanTerm) || 30) * 12);
  const appRate = (parseFloat(appreciationRate) || 0) / 100;

  const mf =
    r === 0
      ? 1 / termMonths
      : (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
  const monthlyPayment = origLoan * mf;

  const getBalance = (months) => {
    const elapsed = Math.min(months, termMonths);
    if (r === 0) return Math.max(0, origLoan - (origLoan / termMonths) * elapsed);
    return Math.max(
      0,
      (origLoan *
        (Math.pow(1 + r, termMonths) - Math.pow(1 + r, elapsed))) /
        (Math.pow(1 + r, termMonths) - 1)
    );
  };

  const getPropertyValue = (years) => origValue * Math.pow(1 + appRate, years);

  const milestones = [0, 1, 2, 3, 5, 7, 10, 15, 20, 25, 30].filter(
    (y) => y <= parseFloat(loanTerm) || 30
  );

  const rows = milestones.map((yr) => {
    const balance = getBalance(yr * 12);
    const propVal = getPropertyValue(yr);
    const equity = Math.max(0, propVal - balance);
    const ltv = propVal > 0 ? (balance / propVal) * 100 : 0;
    const equityPct = propVal > 0 ? (equity / propVal) * 100 : 0;
    return { yr, balance, propVal, equity, ltv, equityPct };
  });

  const currentLTV = rows[0].ltv;

  return (
    <Layout title="LTV & Equity Tracker">
      <h1 style={{ marginBottom: '0.25rem' }}>LTV & Equity Tracker</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Track how your loan-to-value ratio decreases and your equity builds over time through
        principal paydown and property appreciation.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Property & Loan</h2>
          <div style={gridStyle}>
            <Field
              label="Current property value ($)"
              value={propertyValue}
              onChange={setPropertyValue}
            />
            <Field
              label="Current loan balance ($)"
              value={loanAmount}
              onChange={setLoanAmount}
            />
            <Field
              label="Mortgage interest rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} min="1" />
            <Field
              label="Annual property appreciation (%)"
              value={appreciationRate}
              onChange={setAppreciationRate}
              step="0.1"
            />
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Current Snapshot</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { label: 'Property Value', value: fmt(origValue), color: '#3498db' },
              {
                label: 'Loan Balance',
                value: fmt(origLoan),
                color: '#c0392b',
              },
              {
                label: 'Current Equity',
                value: fmt(Math.max(0, origValue - origLoan)),
                color: '#27ae60',
              },
              {
                label: 'Current LTV',
                value: `${currentLTV.toFixed(1)}%`,
                color: currentLTV > 80 ? '#c0392b' : currentLTV > 60 ? '#e67e22' : '#27ae60',
              },
              { label: 'Monthly Payment', value: fmt(monthlyPayment), color: '#555' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  ...sectionStyle,
                  textAlign: 'center',
                  padding: '1rem',
                }}
              >
                <div
                  style={{ fontSize: '1.3rem', fontWeight: 700, color: item.color }}
                >
                  {item.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 4 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Year-by-Year Projection</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  {['Year', 'Property Value', 'Loan Balance', 'Equity', 'Equity %', 'LTV'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          ...tdBase,
                          textAlign: 'right',
                          borderBottom: '2px solid #ccc',
                          fontWeight: 700,
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.yr} style={row.yr === 0 ? { background: '#f5f5f5' } : undefined}>
                    <td style={{ ...tdBase, textAlign: 'right' }}>
                      {row.yr === 0 ? 'Now' : `Yr ${row.yr}`}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(row.propVal)}</td>
                    <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                      {row.balance > 0 ? fmt(row.balance) : 'Paid off'}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60', fontWeight: 600 }}>
                      {fmt(row.equity)}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'right' }}>
                      {row.equityPct.toFixed(1)}%
                    </td>
                    <td
                      style={{
                        ...tdBase,
                        textAlign: 'right',
                        color:
                          row.ltv > 80 ? '#c0392b' : row.ltv > 60 ? '#e67e22' : '#27ae60',
                      }}
                    >
                      {row.ltv.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            LTV below 80% eliminates PMI on conventional loans. LTV below 60% is generally
            considered strong equity. Does not account for cash-out refinances, additional
            principal payments, or market downturns.
          </p>
        </section>
      </div>
    </Layout>
  );
}

import { useState } from 'react';
import Layout from '../../components/Layout';

const fmt = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtSigned = (v) =>
  (v >= 0 ? '+' : '') +
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

export default function RentalVsMortgage() {
  // Investment account
  const [investBalance, setInvestBalance] = useState('500000');
  const [investYield, setInvestYield] = useState('7');

  // Rental property
  const [propertyPrice, setPropertyPrice] = useState('400000');
  const [downPct, setDownPct] = useState('20');
  const [mortgageRate, setMortgageRate] = useState('7');
  const [termYears, setTermYears] = useState('30');
  const [monthlyRent, setMonthlyRent] = useState('2500');
  const [monthlyExpenses, setMonthlyExpenses] = useState('500');
  const [appreciation, setAppreciation] = useState('3');

  // Analysis
  const [analysisYears, setAnalysisYears] = useState('10');

  // ── Derived numbers ──────────────────────────────────────────
  const inv = Math.max(0, parseFloat(investBalance) || 0);
  const yieldRate = (parseFloat(investYield) || 0) / 100;
  const price = Math.max(0, parseFloat(propertyPrice) || 0);
  const down = (price * (parseFloat(downPct) || 0)) / 100;
  const principal = price - down;
  const mRate = (parseFloat(mortgageRate) || 0) / 100 / 12;
  const loanMonths = (parseFloat(termYears) || 30) * 12;
  const rent = Math.max(0, parseFloat(monthlyRent) || 0);
  const expenses = Math.max(0, parseFloat(monthlyExpenses) || 0);
  const appRate = (parseFloat(appreciation) || 0) / 100;
  const years = Math.max(1, parseFloat(analysisYears) || 10);
  const months = years * 12;

  const mortgagePayment =
    mRate === 0
      ? principal / loanMonths
      : (principal * mRate * Math.pow(1 + mRate, loanMonths)) /
        (Math.pow(1 + mRate, loanMonths) - 1);

  const propFV = price * Math.pow(1 + appRate, years);

  // ── Option A: Pay Cash from Investment ──────────────────────
  const cashInvStart = inv - price;
  const cashMonthlyFlow = rent - expenses;
  const cashInvFV = cashInvStart >= 0 ? cashInvStart * Math.pow(1 + yieldRate, years) : 0;
  const cashNetWorth = cashInvFV + propFV;

  // ── Option B: Take Mortgage ──────────────────────────────────
  const mortInvStart = inv - down;
  const mortMonthlyFlow = rent - mortgagePayment - expenses;
  const elapsed = Math.min(months, loanMonths);
  const mortRemainingBalance =
    mRate === 0
      ? Math.max(0, principal - (principal / loanMonths) * elapsed)
      : Math.max(
          0,
          (principal *
            (Math.pow(1 + mRate, loanMonths) - Math.pow(1 + mRate, elapsed))) /
            (Math.pow(1 + mRate, loanMonths) - 1)
        );
  const mortInvFV = mortInvStart >= 0 ? mortInvStart * Math.pow(1 + yieldRate, years) : 0;
  const mortEquity = Math.max(0, propFV - mortRemainingBalance);
  const mortNetWorth = mortInvFV + mortEquity;
  const totalInterest = Math.max(0, mortgagePayment * loanMonths - principal);

  const insufficient = cashInvStart < 0;
  const winner = mortNetWorth > cashNetWorth ? 'mortgage' : 'cash';

  return (
    <Layout title="Rental Property Investment Analyzer">
      <h1 style={{ marginBottom: '0.25rem' }}>Rental Property: Cash vs. Mortgage</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Should you buy a rental property using your investment account, or finance it with a
        mortgage and let your portfolio keep compounding?
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* ── Investment Account ── */}
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Investment Account</h2>
          <div style={gridStyle}>
            <Field label="Current balance ($)" value={investBalance} onChange={setInvestBalance} />
            <Field
              label="Estimated annual yield (%)"
              value={investYield}
              onChange={setInvestYield}
              step="0.1"
            />
          </div>
        </section>

        {/* ── Rental Property ── */}
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Rental Property</h2>
          <div style={gridStyle}>
            <Field label="Property price ($)" value={propertyPrice} onChange={setPropertyPrice} />
            <Field label="Down payment (%)" value={downPct} onChange={setDownPct} min="0" />
            <Field
              label="Mortgage interest rate (%)"
              value={mortgageRate}
              onChange={setMortgageRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={termYears} onChange={setTermYears} min="1" />
            <Field
              label="Expected monthly rent ($)"
              value={monthlyRent}
              onChange={setMonthlyRent}
            />
            <Field
              label="Monthly expenses – taxes, insurance, maintenance ($)"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
            />
            <Field
              label="Annual property appreciation (%)"
              value={appreciation}
              onChange={setAppreciation}
              step="0.1"
            />
          </div>
        </section>

        {/* ── Analysis Period ── */}
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Analysis Period</h2>
          <div style={{ maxWidth: 220 }}>
            <Field
              label="Compare over (years)"
              value={analysisYears}
              onChange={setAnalysisYears}
              min="1"
            />
          </div>
        </section>

        {/* ── Results ── */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Comparison Results</h2>

          {insufficient && (
            <div
              style={{
                padding: '0.9rem 1.1rem',
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: 8,
                marginBottom: '1rem',
              }}
            >
              ⚠️ Your investment account ({fmt(inv)}) is less than the property price ({fmt(price)}).
              Cash purchase is not feasible — results for the mortgage option are still shown below.
            </div>
          )}

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
                    Pay Cash
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Take Mortgage
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Amount withdrawn from investment account</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>{fmt(price)}</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>{fmt(down)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Investment balance after purchase</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>
                    {cashInvStart >= 0 ? (
                      fmt(cashInvStart)
                    ) : (
                      <span style={{ color: '#c0392b' }}>Insufficient</span>
                    )}
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(mortInvStart)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly mortgage payment</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#999' }}>—</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(mortgagePayment)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly rental net cash flow</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: cashMonthlyFlow >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmtSigned(cashMonthlyFlow)}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: mortMonthlyFlow >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmtSigned(mortMonthlyFlow)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Investment account value after {years} yrs</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>
                    {cashInvStart >= 0 ? fmt(cashInvFV) : <span style={{ color: '#999' }}>—</span>}
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(mortInvFV)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Property value after {years} yrs</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(propFV)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(propFV)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Property equity after {years} yrs</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>
                    {cashInvStart >= 0 ? fmt(propFV) : <span style={{ color: '#999' }}>—</span>}
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(mortEquity)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total mortgage interest paid over full term</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#999' }}>—</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    {fmt(totalInterest)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Total estimated net worth after {years} yrs
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        color: '#888',
                        marginTop: 2,
                      }}
                    >
                      Investment account value + property equity
                    </div>
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: !insufficient && winner === 'cash' ? '#27ae60' : undefined,
                    }}
                  >
                    {cashInvStart >= 0 ? fmt(cashNetWorth) : <span style={{ color: '#999' }}>—</span>}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: winner === 'mortgage' ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(mortNetWorth)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {!insufficient && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem 1.25rem',
                background: winner === 'mortgage' ? '#e8f5e9' : '#e3f2fd',
                border: `1px solid ${winner === 'mortgage' ? '#a5d6a7' : '#90caf9'}`,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              {winner === 'mortgage'
                ? `Taking a mortgage comes out ahead by ${fmt(mortNetWorth - cashNetWorth)} over ${years} years — your investment portfolio keeps compounding on the larger balance.`
                : `Paying cash comes out ahead by ${fmt(cashNetWorth - mortNetWorth)} over ${years} years — you avoid mortgage interest and capture full rental profit immediately.`}
            </div>
          )}

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Assumes investment yield and property appreciation compound annually at constant rates.
            Rental income, expenses, and mortgage payments are held constant. Rental cash flow is
            not reinvested. Does not account for income taxes on rent, capital gains tax,
            depreciation deductions, vacancy periods, or inflation.
          </p>
        </section>
      </div>
    </Layout>
  );
}

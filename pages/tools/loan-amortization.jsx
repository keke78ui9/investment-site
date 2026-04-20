import { useState } from 'react';
import Layout from '../../components/Layout';

const fmt = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmt2 = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

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

export default function LoanAmortization() {
  const [loanAmount, setLoanAmount] = useState('300000');
  const [interestRate, setInterestRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');
  const [showFull, setShowFull] = useState(false);

  const principal = Math.max(0, parseFloat(loanAmount) || 0);
  const r = (parseFloat(interestRate) || 0) / 100 / 12;
  const months = Math.max(1, (parseFloat(loanTerm) || 30) * 12);

  const mf =
    r === 0
      ? 1 / months
      : (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const monthlyPayment = principal * mf;
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;

  // Build amortization schedule
  const schedule = [];
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({
      month: m,
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      balance,
    });
  }

  const displayRows = showFull ? schedule : schedule.slice(0, 24);

  // Milestone months
  const halfwayMonth = schedule.findIndex((r) => r.balance <= principal / 2) + 1;
  const halfInterestMonth =
    schedule.findIndex(
      (_, i) =>
        schedule.slice(0, i + 1).reduce((a, r) => a + r.interest, 0) >= totalInterest / 2
    ) + 1;

  return (
    <Layout title="Loan Amortization Table">
      <h1 style={{ marginBottom: '0.25rem' }}>Loan Amortization Table</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        See exactly how each monthly payment is split between principal and interest, and track
        your remaining balance over time.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Loan Details</h2>
          <div style={gridStyle}>
            <Field label="Loan amount ($)" value={loanAmount} onChange={setLoanAmount} />
            <Field
              label="Annual interest rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} min="1" />
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Summary</h2>
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
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Monthly payment</td>
                  <td style={{ ...tdBase, textAlign: 'right', fontWeight: 700, fontSize: '1.05rem' }}>
                    {fmt2(monthlyPayment)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Total amount paid</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalPaid)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total interest paid</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    {fmt(totalInterest)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Interest as % of total</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>
                    {totalPaid > 0 ? ((totalInterest / totalPaid) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Balance reaches 50% (month)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>
                    Month {halfwayMonth} (year {(halfwayMonth / 12).toFixed(1)})
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>50% of interest paid by month</td>
                  <td style={{ ...tdBase, textAlign: 'right', borderBottom: 'none' }}>
                    Month {halfInterestMonth} (year {(halfInterestMonth / 12).toFixed(1)})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>
            Amortization Schedule {!showFull && `(first 24 of ${months} months)`}
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Month
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Payment
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Principal
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Interest
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) => (
                  <tr
                    key={row.month}
                    style={row.month % 12 === 0 ? { background: '#f9f9f9' } : undefined}
                  >
                    <td style={{ ...tdBase, textAlign: 'right' }}>{row.month}</td>
                    <td style={{ ...tdBase, textAlign: 'right' }}>{fmt2(row.payment)}</td>
                    <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                      {fmt2(row.principal)}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                      {fmt2(row.interest)}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'right', fontWeight: 600 }}>
                      {fmt(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {months > 24 && (
            <button
              onClick={() => setShowFull(!showFull)}
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
              {showFull ? `Show first 24 months` : `Show all ${months} months`}
            </button>
          )}
        </section>
      </div>
    </Layout>
  );
}

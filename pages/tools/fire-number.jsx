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

export default function FIRENumber() {
  const [annualExpenses, setAnnualExpenses] = useState('60000');
  const [withdrawalRate, setWithdrawalRate] = useState('4');
  const [currentSavings, setCurrentSavings] = useState('150000');
  const [annualContrib, setAnnualContrib] = useState('24000');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [currentAge, setCurrentAge] = useState('30');
  const [targetAge, setTargetAge] = useState('50');

  const expenses = Math.max(0, parseFloat(annualExpenses) || 0);
  const wdRate = Math.max(0.1, parseFloat(withdrawalRate) || 4) / 100;
  const savings = Math.max(0, parseFloat(currentSavings) || 0);
  const contrib = Math.max(0, parseFloat(annualContrib) || 0);
  const r = (parseFloat(annualReturn) || 0) / 100;
  const age = parseFloat(currentAge) || 30;
  const target = parseFloat(targetAge) || 50;

  const fireNumber = expenses / wdRate;
  const monthlyIncome = expenses / 12;

  // Project savings year by year to find when we hit FIRE number
  let yearsToFire = null;
  let balance = savings;
  for (let yr = 1; yr <= 60; yr++) {
    balance = balance * (1 + r) + contrib;
    if (balance >= fireNumber) {
      yearsToFire = yr;
      break;
    }
  }

  const fireAge = yearsToFire != null ? age + yearsToFire : null;
  const targetYears = Math.max(0, target - age);

  // Projected balance at target age
  let balanceAtTarget = savings;
  for (let yr = 1; yr <= targetYears; yr++) {
    balanceAtTarget = balanceAtTarget * (1 + r) + contrib;
  }
  const gapAtTarget = fireNumber - balanceAtTarget;

  // Monthly contribution needed to hit FIRE by target age
  let requiredMonthly = null;
  if (targetYears > 0) {
    const monthlyRate = r / 12;
    const months = targetYears * 12;
    const savingsFV = savings * Math.pow(1 + r, targetYears);
    const needed = fireNumber - savingsFV;
    if (monthlyRate === 0) {
      requiredMonthly = needed / months;
    } else {
      requiredMonthly = needed > 0
        ? needed / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
        : 0;
    }
  }

  return (
    <Layout title="FIRE Number Calculator">
      <h1 style={{ marginBottom: '0.25rem' }}>FIRE Number Calculator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Financial Independence, Retire Early — calculate your FIRE number and how long it will take
        to reach it based on your savings rate and expected returns.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Retirement Spending</h2>
          <div style={gridStyle}>
            <Field
              label="Annual expenses in retirement ($)"
              value={annualExpenses}
              onChange={setAnnualExpenses}
            />
            <Field
              label="Safe withdrawal rate (%)"
              value={withdrawalRate}
              onChange={setWithdrawalRate}
              step="0.1"
              min="0.1"
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Current Situation</h2>
          <div style={gridStyle}>
            <Field
              label="Current savings / investments ($)"
              value={currentSavings}
              onChange={setCurrentSavings}
            />
            <Field
              label="Annual contribution ($)"
              value={annualContrib}
              onChange={setAnnualContrib}
            />
            <Field
              label="Expected annual return (%)"
              value={annualReturn}
              onChange={setAnnualReturn}
              step="0.1"
            />
            <Field
              label="Current age"
              value={currentAge}
              onChange={setCurrentAge}
              min="1"
            />
            <Field
              label="Target retirement age"
              value={targetAge}
              onChange={setTargetAge}
              min="1"
            />
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
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>
                    Your FIRE number ({withdrawalRate}% withdrawal rule)
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', fontSize: '1.05rem', color: '#27ae60' }}>
                    {fmt(fireNumber)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly income this provides</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(monthlyIncome)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Current savings gap to FIRE</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: savings >= fireNumber ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {savings >= fireNumber ? 'Already at FIRE!' : fmt(fireNumber - savings)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Years to reach FIRE number (at current rate)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: yearsToFire != null ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {yearsToFire != null
                      ? `${yearsToFire} years (age ${Math.round(fireAge)})`
                      : 'Not achievable at current rate'}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>
                    Projected balance at target retirement age ({Math.round(target)})
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: balanceAtTarget >= fireNumber ? '#27ae60' : '#e67e22',
                    }}
                  >
                    {fmt(balanceAtTarget)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Gap at target age</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: gapAtTarget <= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {gapAtTarget <= 0 ? 'On track!' : fmt(gapAtTarget) + ' short'}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Monthly savings needed to retire by age {Math.round(target)}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {requiredMonthly != null
                      ? requiredMonthly <= 0
                        ? 'Already on track!'
                        : fmt(requiredMonthly) + '/mo'
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            The 4% rule assumes a 30-year retirement with a diversified portfolio. For early
            retirement (40+ years), consider 3–3.5%. Does not account for Social Security, taxes,
            inflation, or healthcare costs.
          </p>
        </section>
      </div>
    </Layout>
  );
}

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

export default function RetirementSavings() {
  const [currentAge, setCurrentAge] = useState('35');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('80000');
  const [monthlyContrib, setMonthlyContrib] = useState('1000');
  const [monthlyExpenses, setMonthlyExpenses] = useState('5000');
  const [returnRate, setReturnRate] = useState('7');
  const [inflationRate, setInflationRate] = useState('3');
  const [retirementDuration, setRetirementDuration] = useState('25');

  const cAge = Math.max(1, parseFloat(currentAge) || 35);
  const rAge = Math.max(cAge + 1, parseFloat(retirementAge) || 65);
  const savings = Math.max(0, parseFloat(currentSavings) || 0);
  const monthly = Math.max(0, parseFloat(monthlyContrib) || 0);
  const expenses = Math.max(0, parseFloat(monthlyExpenses) || 0);
  const r = (parseFloat(returnRate) || 0) / 100;
  const inf = (parseFloat(inflationRate) || 0) / 100;
  const retDuration = Math.max(1, parseFloat(retirementDuration) || 25);

  const yearsToRetire = rAge - cAge;
  const monthlyRate = r / 12;
  const months = yearsToRetire * 12;

  // Projected balance at retirement
  const savingsFV = savings * Math.pow(1 + r, yearsToRetire);
  let contribFV;
  if (monthlyRate === 0) {
    contribFV = monthly * months;
  } else {
    contribFV = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }
  const projectedBalance = savingsFV + contribFV;

  // Inflation-adjusted monthly expenses at retirement
  const futureMonthlyExpenses = expenses * Math.pow(1 + inf, yearsToRetire);
  const annualExpenses = futureMonthlyExpenses * 12;

  // Nest egg needed (PV of annuity for retDuration years at real return)
  const realReturn = (1 + r) / (1 + inf) - 1;
  let nestEggNeeded;
  if (realReturn === 0) {
    nestEggNeeded = annualExpenses * retDuration;
  } else {
    nestEggNeeded =
      annualExpenses * ((1 - Math.pow(1 + realReturn, -retDuration)) / realReturn);
  }

  const gap = nestEggNeeded - projectedBalance;
  const onTrack = gap <= 0;

  // Monthly savings needed to hit nest egg goal
  let requiredMonthly = null;
  if (yearsToRetire > 0) {
    const needed = nestEggNeeded - savingsFV;
    if (monthlyRate === 0) {
      requiredMonthly = needed / months;
    } else {
      requiredMonthly =
        needed > 0
          ? needed / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
          : 0;
    }
  }

  // Monthly income the projected balance can sustain
  let monthlyIncomeFromPortfolio;
  if (realReturn === 0) {
    monthlyIncomeFromPortfolio = projectedBalance / (retDuration * 12);
  } else {
    const monthlyRealRate = Math.pow(1 + realReturn, 1 / 12) - 1;
    const retMonths = retDuration * 12;
    monthlyIncomeFromPortfolio =
      (projectedBalance * monthlyRealRate) /
      (1 - Math.pow(1 + monthlyRealRate, -retMonths));
  }

  return (
    <Layout title="Retirement Savings Goal Tracker">
      <h1 style={{ marginBottom: '0.25rem' }}>Retirement Savings Goal Tracker</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Find out if you're on track for retirement, how much you'll need, and what monthly
        savings will close any gap.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Your Situation</h2>
          <div style={gridStyle}>
            <Field label="Current age" value={currentAge} onChange={setCurrentAge} min="1" />
            <Field
              label="Target retirement age"
              value={retirementAge}
              onChange={setRetirementAge}
              min="1"
            />
            <Field
              label="Current retirement savings ($)"
              value={currentSavings}
              onChange={setCurrentSavings}
            />
            <Field
              label="Monthly contribution ($)"
              value={monthlyContrib}
              onChange={setMonthlyContrib}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Assumptions</h2>
          <div style={gridStyle}>
            <Field
              label="Expected annual return (%)"
              value={returnRate}
              onChange={setReturnRate}
              step="0.1"
            />
            <Field
              label="Annual inflation rate (%)"
              value={inflationRate}
              onChange={setInflationRate}
              step="0.1"
            />
            <Field
              label="Monthly expenses in retirement (today's $)"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
            />
            <Field
              label="Retirement duration (years)"
              value={retirementDuration}
              onChange={setRetirementDuration}
              min="1"
            />
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Results</h2>

          <div
            style={{
              padding: '0.9rem 1.1rem',
              background: onTrack ? '#e8f5e9' : '#fff3cd',
              border: `1px solid ${onTrack ? '#a5d6a7' : '#ffc107'}`,
              borderRadius: 8,
              marginBottom: '1rem',
              fontWeight: 600,
            }}
          >
            {onTrack
              ? `You're on track! Your projected savings exceeds the goal by ${fmt(Math.abs(gap))}.`
              : `You have a projected shortfall of ${fmt(gap)} at retirement. Consider increasing contributions.`}
          </div>

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
                  <td style={tdBase}>Years until retirement</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{yearsToRetire} years</td>
                </tr>
                <tr>
                  <td style={tdBase}>
                    Monthly expenses at retirement (inflation-adjusted)
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(futureMonthlyExpenses)}</td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>Nest egg needed</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#3498db', fontSize: '1.05rem' }}>
                    {fmt(nestEggNeeded)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>Projected balance at retirement</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      fontSize: '1.05rem',
                      color: onTrack ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmt(projectedBalance)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly income your portfolio can sustain</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>
                    {fmt(monthlyIncomeFromPortfolio)}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Monthly savings needed to meet goal
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontWeight: 600,
                      color: requiredMonthly != null && requiredMonthly > monthly ? '#c0392b' : '#27ae60',
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
            Nest egg calculated as the present value of {retirementDuration} years of retirement
            expenses at the real (inflation-adjusted) return rate. Does not include Social Security,
            pension income, or taxes on withdrawals.
          </p>
        </section>
      </div>
    </Layout>
  );
}

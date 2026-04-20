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

export default function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState('100000');
  const [inflationRate, setInflationRate] = useState('3');
  const [years, setYears] = useState('20');

  const amount = Math.max(0, parseFloat(currentAmount) || 0);
  const inf = (parseFloat(inflationRate) || 0) / 100;
  const t = Math.max(1, parseFloat(years) || 1);

  // Purchasing power of today's amount in future dollars
  const futureEquivalent = amount * Math.pow(1 + inf, t);
  // What today's amount is worth in future terms (purchasing power loss)
  const purchasingPowerFuture = amount / Math.pow(1 + inf, t);
  const purchasingPowerLoss = amount - purchasingPowerFuture;
  const purchasingPowerLossPct = amount > 0 ? (purchasingPowerLoss / amount) * 100 : 0;

  // Rule of 72: years for prices to double
  const doubleYears = inf > 0 ? 72 / (inf * 100) : Infinity;

  const milestones = [1, 2, 3, 5, 10, 15, 20, 25, 30].filter((y) => y <= Math.min(t, 30));

  const rows = milestones.map((yr) => {
    const needed = amount * Math.pow(1 + inf, yr);
    const worth = amount / Math.pow(1 + inf, yr);
    return { yr, needed, worth };
  });

  return (
    <Layout title="Inflation Purchasing Power Calculator">
      <h1 style={{ marginBottom: '0.25rem' }}>Inflation Purchasing Power Calculator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        See how inflation erodes the purchasing power of money over time, and how much you'll need
        in the future to match today's spending.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Parameters</h2>
          <div style={gridStyle}>
            <Field
              label="Amount in today's dollars ($)"
              value={currentAmount}
              onChange={setCurrentAmount}
            />
            <Field
              label="Annual inflation rate (%)"
              value={inflationRate}
              onChange={setInflationRate}
              step="0.1"
            />
            <Field
              label="Years into the future"
              value={years}
              onChange={setYears}
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
                <tr>
                  <td style={tdBase}>Starting amount (today)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(amount)}</td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>
                    Amount needed in {Math.round(t)} years to match today's purchasing power
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', fontSize: '1.05rem', color: '#c0392b' }}>
                    {fmt(futureEquivalent)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>
                    What {fmt(amount)} today will be worth in {Math.round(t)} years
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', fontSize: '1.05rem', color: '#e67e22' }}>
                    {fmt(purchasingPowerFuture)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Purchasing power lost</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    {fmt(purchasingPowerLoss)} ({purchasingPowerLossPct.toFixed(1)}%)
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Years for prices to double (Rule of 72)
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', borderBottom: 'none' }}>
                    {inf > 0 ? `~${doubleYears.toFixed(1)} years` : 'Never'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Year-by-Year Breakdown</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
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
                    Year
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Need This Much (future $)
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Your Money Worth (today's $)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.yr}>
                    <td style={{ ...tdBase, textAlign: 'right' }}>{row.yr}</td>
                    <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                      {fmt(row.needed)}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'right', color: '#e67e22' }}>
                      {fmt(row.worth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Uses a constant annual inflation rate for illustration. Actual inflation varies year to
            year. The U.S. Federal Reserve targets 2% annual inflation. Historical U.S. average is
            approximately 3.1%.
          </p>
        </section>
      </div>
    </Layout>
  );
}

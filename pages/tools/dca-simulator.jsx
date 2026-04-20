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

export default function DCASimulator() {
  const [monthlyAmount, setMonthlyAmount] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [years, setYears] = useState('20');
  const [initialLumpSum, setInitialLumpSum] = useState('0');

  const monthly = Math.max(0, parseFloat(monthlyAmount) || 0);
  const r = (parseFloat(annualReturn) || 0) / 100;
  const t = Math.max(1, parseFloat(years) || 1);
  const lump = Math.max(0, parseFloat(initialLumpSum) || 0);

  const monthlyRate = r / 12;
  const months = t * 12;

  // DCA Future Value
  // lump sum component + monthly DCA component
  const lumpFV = lump * Math.pow(1 + r, t);
  let dcaFV;
  if (monthlyRate === 0) {
    dcaFV = monthly * months;
  } else {
    dcaFV = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  }
  const totalDCAFV = lumpFV + dcaFV;
  const totalDCAInvested = lump + monthly * months;
  const dcaGain = totalDCAFV - totalDCAInvested;

  // Lump Sum comparison: invest entire DCA total on day 1
  const totalToInvest = totalDCAInvested;
  const lumpSumFV = totalToInvest * Math.pow(1 + r, t);
  const lumpSumGain = lumpSumFV - totalToInvest;

  const lumpSumBetter = lumpSumFV > totalDCAFV;
  const difference = Math.abs(lumpSumFV - totalDCAFV);

  return (
    <Layout title="Dollar-Cost Averaging Simulator">
      <h1 style={{ marginBottom: '0.25rem' }}>Dollar-Cost Averaging Simulator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Compare investing a fixed amount monthly (DCA) against investing the full amount as a lump
        sum on day one.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Investment Parameters</h2>
          <div style={gridStyle}>
            <Field
              label="Monthly DCA amount ($)"
              value={monthlyAmount}
              onChange={setMonthlyAmount}
            />
            <Field
              label="Initial lump sum (if any) ($)"
              value={initialLumpSum}
              onChange={setInitialLumpSum}
            />
            <Field
              label="Expected annual return (%)"
              value={annualReturn}
              onChange={setAnnualReturn}
              step="0.1"
            />
            <Field label="Investment period (years)" value={years} onChange={setYears} min="1" />
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Comparison Results</h2>
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
                    DCA Strategy
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Lump Sum
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Total invested</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalDCAInvested)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalToInvest)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total gain</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(dcaGain)}
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(lumpSumGain)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Final portfolio value after {Math.round(t)} years
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: !lumpSumBetter ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(totalDCAFV)}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: lumpSumBetter ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(lumpSumFV)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: lumpSumBetter ? '#e3f2fd' : '#e8f5e9',
              border: `1px solid ${lumpSumBetter ? '#90caf9' : '#a5d6a7'}`,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {lumpSumBetter
              ? `Lump sum investing comes out ahead by ${fmt(difference)} over ${Math.round(t)} years — statistically, lump sum outperforms DCA ~2/3 of the time in rising markets.`
              : `DCA comes out ahead by ${fmt(difference)} over ${Math.round(t)} years (due to the initial lump sum boost). Without the lump sum, lump-sum investing typically wins in trending-up markets.`}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Assumes a constant annual return. In real markets, DCA reduces timing risk and
            emotional investing mistakes. Lump sum has higher expected returns but higher short-term
            volatility risk. Does not account for taxes, fees, or market fluctuations.
          </p>
        </section>
      </div>
    </Layout>
  );
}

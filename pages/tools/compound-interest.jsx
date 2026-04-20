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

const FREQUENCIES = [
  { label: 'Annually (1×/year)', value: 1 },
  { label: 'Semi-annually (2×/year)', value: 2 },
  { label: 'Quarterly (4×/year)', value: 4 },
  { label: 'Monthly (12×/year)', value: 12 },
  { label: 'Daily (365×/year)', value: 365 },
];

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState('10000');
  const [annualContrib, setAnnualContrib] = useState('6000');
  const [rate, setRate] = useState('7');
  const [years, setYears] = useState('20');
  const [frequency, setFrequency] = useState(12);
  const [showTable, setShowTable] = useState(false);

  const P = Math.max(0, parseFloat(principal) || 0);
  const C = Math.max(0, parseFloat(annualContrib) || 0);
  const r = (parseFloat(rate) || 0) / 100;
  const n = parseInt(frequency) || 12;
  const t = Math.max(1, parseFloat(years) || 1);

  // Compound interest with periodic contributions
  // FV = P*(1+r/n)^(n*t) + C/n * [((1+r/n)^(n*t) - 1) / (r/n)]
  const rn = r / n;
  const periods = n * t;
  const growthFactor = Math.pow(1 + rn, periods);

  let fv;
  if (rn === 0) {
    fv = P + C * t;
  } else {
    fv = P * growthFactor + (C / n) * ((growthFactor - 1) / rn);
  }

  const totalContributions = P + C * t;
  const totalInterest = fv - totalContributions;

  // Build year-by-year table
  const tableData = [];
  for (let yr = 1; yr <= Math.min(t, 50); yr++) {
    const gf = Math.pow(1 + rn, n * yr);
    const val = rn === 0 ? P + C * yr : P * gf + (C / n) * ((gf - 1) / rn);
    const contributed = P + C * yr;
    tableData.push({ year: yr, value: val, contributed, interest: val - contributed });
  }

  return (
    <Layout title="Compound Interest Calculator">
      <h1 style={{ marginBottom: '0.25rem' }}>Compound Interest Calculator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        See how your money grows over time with compound interest and regular contributions.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Investment Details</h2>
          <div style={gridStyle}>
            <Field
              label="Initial principal ($)"
              value={principal}
              onChange={setPrincipal}
            />
            <Field
              label="Annual contribution ($)"
              value={annualContrib}
              onChange={setAnnualContrib}
            />
            <Field
              label="Annual interest rate (%)"
              value={rate}
              onChange={setRate}
              step="0.1"
            />
            <Field label="Years" value={years} onChange={setYears} min="1" />
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>
                Compounding frequency
              </span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                style={{ ...inputStyle }}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
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
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Initial principal</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(P)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total contributions over {Math.round(t)} years</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(C * t)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total amount contributed (principal + contributions)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalContributions)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total interest earned</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(totalInterest)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Future value after {Math.round(t)} years
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: '#27ae60',
                    }}
                  >
                    {fmt(fv)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual breakdown bar */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', fontWeight: 600 }}>
              Growth breakdown
            </div>
            <div
              style={{
                display: 'flex',
                height: 28,
                borderRadius: 6,
                overflow: 'hidden',
                background: '#eee',
              }}
            >
              <div
                style={{
                  width: fv > 0 ? `${(P / fv) * 100}%` : '0%',
                  background: '#3498db',
                  transition: 'width 0.3s',
                }}
                title={`Principal: ${fmt(P)}`}
              />
              <div
                style={{
                  width: fv > 0 ? `${(C * t / fv) * 100}%` : '0%',
                  background: '#2ecc71',
                  transition: 'width 0.3s',
                }}
                title={`Contributions: ${fmt(C * t)}`}
              />
              <div
                style={{
                  width: fv > 0 ? `${(totalInterest / fv) * 100}%` : '0%',
                  background: '#f39c12',
                  transition: 'width 0.3s',
                }}
                title={`Interest: ${fmt(totalInterest)}`}
              />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
              <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#3498db', borderRadius: 2, marginRight: 4 }} />Principal {fmt(P)}</span>
              <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#2ecc71', borderRadius: 2, marginRight: 4 }} />Contributions {fmt(C * t)}</span>
              <span><span style={{ display: 'inline-block', width: 12, height: 12, background: '#f39c12', borderRadius: 2, marginRight: 4 }} />Interest {fmt(totalInterest)}</span>
            </div>
          </div>

          {/* Year-by-year table toggle */}
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => setShowTable(!showTable)}
              style={{
                padding: '0.45rem 1rem',
                border: '1px solid #ccc',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              {showTable ? 'Hide' : 'Show'} year-by-year growth table
            </button>

            {showTable && (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table
                  style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}
                >
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Year</th>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Total Contributed</th>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Interest Earned</th>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.year}>
                        <td style={{ ...tdBase, textAlign: 'right' }}>{row.year}</td>
                        <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(row.contributed)}</td>
                        <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                          {fmt(row.interest)}
                        </td>
                        <td style={{ ...tdBase, textAlign: 'right', fontWeight: 600 }}>
                          {fmt(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Annual contribution is distributed evenly across compounding periods. Does not account
            for taxes, inflation, or investment fees. Table limited to 50 years.
          </p>
        </section>
      </div>
    </Layout>
  );
}

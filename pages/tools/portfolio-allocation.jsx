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
  gap: '1rem',
};

function Field({ label, value, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>{label}</span>
      <input
        type="number"
        value={value}
        min="0"
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const ASSET_COLORS = ['#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c'];

const ASSET_LABELS = ['US Stocks', 'International Stocks', 'Bonds', 'Real Estate / REITs', 'Cash & Alternatives'];
const ASSET_DEFAULTS = ['200000', '80000', '60000', '40000', '20000'];

export default function PortfolioAllocation() {
  const [values, setValues] = useState(ASSET_DEFAULTS);

  const setVal = (i) => (v) => {
    const next = [...values];
    next[i] = v;
    setValues(next);
  };

  const nums = values.map((v) => Math.max(0, parseFloat(v) || 0));
  const total = nums.reduce((a, b) => a + b, 0);
  const pcts = nums.map((v) => (total > 0 ? (v / total) * 100 : 0));

  const TARGET_MODERATE = [50, 20, 20, 5, 5];
  const TARGET_AGGRESSIVE = [60, 25, 10, 5, 0];
  const TARGET_CONSERVATIVE = [30, 10, 50, 5, 5];

  const deviation = (target) =>
    pcts.reduce((acc, p, i) => acc + Math.abs(p - target[i]), 0).toFixed(1);

  return (
    <Layout title="Portfolio Allocation Visualizer">
      <h1 style={{ marginBottom: '0.25rem' }}>Portfolio Allocation Visualizer</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Enter your holdings by asset class to visualize your current allocation and compare against
        model portfolios.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Your Holdings</h2>
          <div style={gridStyle}>
            {ASSET_LABELS.map((label, i) => (
              <Field key={label} label={`${label} ($)`} value={values[i]} onChange={setVal(i)} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Allocation Breakdown</h2>

          <div
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#333',
            }}
          >
            Total Portfolio: {fmt(total)}
          </div>

          {/* Stacked bar */}
          <div
            style={{
              display: 'flex',
              height: 36,
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: '1rem',
              background: '#eee',
            }}
          >
            {nums.map((v, i) =>
              total > 0 && v > 0 ? (
                <div
                  key={i}
                  style={{
                    width: `${(v / total) * 100}%`,
                    background: ASSET_COLORS[i],
                    transition: 'width 0.3s',
                  }}
                  title={`${ASSET_LABELS[i]}: ${fmt(v)} (${pcts[i].toFixed(1)}%)`}
                />
              ) : null
            )}
          </div>

          {/* Legend & breakdown rows */}
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {ASSET_LABELS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: ASSET_COLORS[i],
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, fontSize: '0.9rem' }}>{label}</div>
                <div style={{ width: 120, fontSize: '0.9rem', textAlign: 'right' }}>
                  {fmt(nums[i])}
                </div>
                <div
                  style={{
                    width: 60,
                    fontSize: '0.9rem',
                    textAlign: 'right',
                    fontWeight: 600,
                    color: '#555',
                  }}
                >
                  {pcts[i].toFixed(1)}%
                </div>
                {/* Bar */}
                <div
                  style={{
                    flex: 2,
                    height: 10,
                    background: '#eee',
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pcts[i]}%`,
                      height: '100%',
                      background: ASSET_COLORS[i],
                      borderRadius: 5,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Model portfolio comparison */}
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Model Portfolio Comparison</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th
                    style={{
                      padding: '0.55rem 0.75rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Asset Class
                  </th>
                  <th
                    style={{
                      padding: '0.55rem 0.75rem',
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Yours
                  </th>
                  <th
                    style={{
                      padding: '0.55rem 0.75rem',
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Conservative
                  </th>
                  <th
                    style={{
                      padding: '0.55rem 0.75rem',
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Moderate
                  </th>
                  <th
                    style={{
                      padding: '0.55rem 0.75rem',
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Aggressive
                  </th>
                </tr>
              </thead>
              <tbody>
                {ASSET_LABELS.map((label, i) => (
                  <tr key={label}>
                    <td style={{ padding: '0.55rem 0.75rem', borderBottom: '1px solid #eee' }}>
                      {label}
                    </td>
                    <td
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderBottom: '1px solid #eee',
                        textAlign: 'right',
                        fontWeight: 600,
                      }}
                    >
                      {pcts[i].toFixed(1)}%
                    </td>
                    <td
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderBottom: '1px solid #eee',
                        textAlign: 'right',
                        color: '#888',
                      }}
                    >
                      {TARGET_CONSERVATIVE[i]}%
                    </td>
                    <td
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderBottom: '1px solid #eee',
                        textAlign: 'right',
                        color: '#888',
                      }}
                    >
                      {TARGET_MODERATE[i]}%
                    </td>
                    <td
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderBottom: '1px solid #eee',
                        textAlign: 'right',
                        color: '#888',
                      }}
                    >
                      {TARGET_AGGRESSIVE[i]}%
                    </td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ padding: '0.55rem 0.75rem' }}>Total drift from model</td>
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>—</td>
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>
                    {deviation(TARGET_CONSERVATIVE)}%
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>
                    {deviation(TARGET_MODERATE)}%
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right' }}>
                    {deviation(TARGET_AGGRESSIVE)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Model portfolios are illustrative examples. Drift = sum of absolute differences
            between your allocation and the model. Lower drift means closer alignment.
          </p>
        </section>
      </div>
    </Layout>
  );
}

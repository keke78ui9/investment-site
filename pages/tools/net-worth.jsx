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

function Bar({ value, total, color }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div
      style={{
        flex: 3,
        height: 10,
        background: '#eee',
        borderRadius: 5,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 5,
          transition: 'width 0.3s',
        }}
      />
    </div>
  );
}

const ASSET_FIELDS = [
  { key: 'checking', label: 'Checking & Savings', color: '#3498db' },
  { key: 'investments', label: 'Brokerage / Investments', color: '#2ecc71' },
  { key: 'retirement', label: 'Retirement Accounts (401k, IRA)', color: '#27ae60' },
  { key: 'realEstate', label: 'Real Estate (market value)', color: '#e67e22' },
  { key: 'vehicles', label: 'Vehicles', color: '#f39c12' },
  { key: 'otherAssets', label: 'Other Assets', color: '#95a5a6' },
];

const LIABILITY_FIELDS = [
  { key: 'mortgage', label: 'Mortgage Balance', color: '#c0392b' },
  { key: 'autoLoans', label: 'Auto Loans', color: '#e74c3c' },
  { key: 'studentLoans', label: 'Student Loans', color: '#e67e22' },
  { key: 'creditCards', label: 'Credit Card Balances', color: '#c0392b' },
  { key: 'otherLiabilities', label: 'Other Liabilities', color: '#e74c3c' },
];

export default function NetWorth() {
  const [assets, setAssets] = useState({
    checking: '25000',
    investments: '80000',
    retirement: '120000',
    realEstate: '350000',
    vehicles: '25000',
    otherAssets: '0',
  });

  const [liabilities, setLiabilities] = useState({
    mortgage: '280000',
    autoLoans: '12000',
    studentLoans: '18000',
    creditCards: '3500',
    otherLiabilities: '0',
  });

  const setAsset = (key) => (val) => setAssets((a) => ({ ...a, [key]: val }));
  const setLiability = (key) => (val) => setLiabilities((l) => ({ ...l, [key]: val }));

  const assetVals = ASSET_FIELDS.reduce((acc, f) => {
    acc[f.key] = Math.max(0, parseFloat(assets[f.key]) || 0);
    return acc;
  }, {});

  const liabilityVals = LIABILITY_FIELDS.reduce((acc, f) => {
    acc[f.key] = Math.max(0, parseFloat(liabilities[f.key]) || 0);
    return acc;
  }, {});

  const totalAssets = Object.values(assetVals).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilityVals).reduce((a, b) => a + b, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  return (
    <Layout title="Net Worth Snapshot Builder">
      <h1 style={{ marginBottom: '0.25rem' }}>Net Worth Snapshot Builder</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Calculate your net worth by entering your assets and liabilities. Track your financial
        health at a glance.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Assets */}
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#27ae60' }}>
              Assets
            </h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {ASSET_FIELDS.map((f) => (
                <Field
                  key={f.key}
                  label={`${f.label} ($)`}
                  value={assets[f.key]}
                  onChange={setAsset(f.key)}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e0e0e0',
                fontWeight: 700,
                fontSize: '1.05rem',
                color: '#27ae60',
              }}
            >
              Total Assets: {fmt(totalAssets)}
            </div>
          </section>

          {/* Liabilities */}
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', color: '#c0392b' }}>
              Liabilities
            </h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {LIABILITY_FIELDS.map((f) => (
                <Field
                  key={f.key}
                  label={`${f.label} ($)`}
                  value={liabilities[f.key]}
                  onChange={setLiability(f.key)}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e0e0e0',
                fontWeight: 700,
                fontSize: '1.05rem',
                color: '#c0392b',
              }}
            >
              Total Liabilities: {fmt(totalLiabilities)}
            </div>
          </section>
        </div>

        {/* Net Worth Summary */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Net Worth Summary</h2>

          <div
            style={{
              padding: '1.5rem',
              background: netWorth >= 0 ? '#e8f5e9' : '#ffebee',
              border: `2px solid ${netWorth >= 0 ? '#a5d6a7' : '#ef9a9a'}`,
              borderRadius: 10,
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Net Worth (Assets − Liabilities)
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: netWorth >= 0 ? '#27ae60' : '#c0392b',
              }}
            >
              {fmt(netWorth)}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
              Debt-to-asset ratio: {debtToAssetRatio.toFixed(1)}%
            </div>
          </div>

          {/* Asset breakdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Asset Breakdown</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {ASSET_FIELDS.map((f) => (
                <div
                  key={f.key}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: f.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 2, fontSize: '0.88rem' }}>{f.label}</div>
                  <div style={{ width: 100, textAlign: 'right', fontSize: '0.88rem' }}>
                    {fmt(assetVals[f.key])}
                  </div>
                  <div style={{ width: 50, textAlign: 'right', fontSize: '0.88rem', color: '#888' }}>
                    {totalAssets > 0 ? ((assetVals[f.key] / totalAssets) * 100).toFixed(1) : 0}%
                  </div>
                  <Bar value={assetVals[f.key]} total={totalAssets} color={f.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Liability breakdown */}
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Liability Breakdown</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {LIABILITY_FIELDS.map((f) => (
                <div
                  key={f.key}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: f.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 2, fontSize: '0.88rem' }}>{f.label}</div>
                  <div style={{ width: 100, textAlign: 'right', fontSize: '0.88rem' }}>
                    {fmt(liabilityVals[f.key])}
                  </div>
                  <div style={{ width: 50, textAlign: 'right', fontSize: '0.88rem', color: '#888' }}>
                    {totalLiabilities > 0
                      ? ((liabilityVals[f.key] / totalLiabilities) * 100).toFixed(1)
                      : 0}%
                  </div>
                  <Bar value={liabilityVals[f.key]} total={totalLiabilities} color={f.color} />
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1.5rem', lineHeight: 1.5 }}>
            Use current market values for assets, not original purchase prices. A healthy
            debt-to-asset ratio is generally below 36%. Net worth is a snapshot — track it
            quarterly to measure your financial progress.
          </p>
        </section>
      </div>
    </Layout>
  );
}

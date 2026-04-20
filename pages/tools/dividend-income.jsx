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

export default function DividendIncome() {
  const [portfolioValue, setPortfolioValue] = useState('500000');
  const [dividendYield, setDividendYield] = useState('3');
  const [growthRate, setGrowthRate] = useState('5');
  const [years, setYears] = useState('10');
  const [taxRate, setTaxRate] = useState('15');

  const portfolio = Math.max(0, parseFloat(portfolioValue) || 0);
  const yld = (parseFloat(dividendYield) || 0) / 100;
  const growth = (parseFloat(growthRate) || 0) / 100;
  const t = Math.max(1, parseFloat(years) || 1);
  const tax = (parseFloat(taxRate) || 0) / 100;

  const currentAnnualIncome = portfolio * yld;
  const currentMonthlyIncome = currentAnnualIncome / 12;
  const currentAfterTax = currentAnnualIncome * (1 - tax);
  const currentAfterTaxMonthly = currentAfterTax / 12;

  // After t years, assuming portfolio grows at dividend growth rate
  const portfolioFuture = portfolio * Math.pow(1 + growth, t);
  const futureAnnualIncome = portfolioFuture * yld;
  const futureMonthlyIncome = futureAnnualIncome / 12;
  const futureAfterTax = futureAnnualIncome * (1 - tax);
  const futureAfterTaxMonthly = futureAfterTax / 12;

  // Cumulative dividends received over t years (growing annually)
  let cumulative = 0;
  for (let i = 0; i < t; i++) {
    cumulative += portfolio * Math.pow(1 + growth, i) * yld;
  }
  const cumulativeAfterTax = cumulative * (1 - tax);

  // Yield on cost (if portfolio grows at growth rate but original cost stays)
  const yieldOnCost = portfolio > 0 ? (futureAnnualIncome / portfolio) * 100 : 0;

  // Build projection table
  const tableData = [];
  for (let yr = 1; yr <= Math.min(t, 30); yr++) {
    const pv = portfolio * Math.pow(1 + growth, yr);
    const income = pv * yld;
    const afterTax = income * (1 - tax);
    tableData.push({ year: yr, portfolioValue: pv, annualIncome: income, afterTax });
  }

  const [showTable, setShowTable] = useState(false);

  return (
    <Layout title="Dividend Yield & Income Estimator">
      <h1 style={{ marginBottom: '0.25rem' }}>Dividend Yield & Income Estimator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Project current and future dividend income from your portfolio, accounting for dividend
        growth and taxes.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Portfolio Details</h2>
          <div style={gridStyle}>
            <Field
              label="Portfolio value ($)"
              value={portfolioValue}
              onChange={setPortfolioValue}
            />
            <Field
              label="Dividend yield (%)"
              value={dividendYield}
              onChange={setDividendYield}
              step="0.1"
            />
            <Field
              label="Annual dividend / portfolio growth rate (%)"
              value={growthRate}
              onChange={setGrowthRate}
              step="0.1"
            />
            <Field
              label="Dividend tax rate (%)"
              value={taxRate}
              onChange={setTaxRate}
              step="0.5"
            />
            <Field
              label="Projection period (years)"
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
                    Today
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    After {Math.round(t)} Years
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Portfolio value</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(portfolio)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(portfolioFuture)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Annual dividend income (gross)</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(currentAnnualIncome)}
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(futureAnnualIncome)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly dividend income (gross)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt2(currentMonthlyIncome)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt2(futureMonthlyIncome)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Annual income after {taxRate}% tax</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(currentAfterTax)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(futureAfterTax)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly income after tax</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt2(currentAfterTaxMonthly)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt2(futureAfterTaxMonthly)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Yield on original cost (after {Math.round(t)} yrs)</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#999' }}>
                    {(yld * 100).toFixed(2)}%
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {yieldOnCost.toFixed(2)}%
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Cumulative dividends received (after tax)
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', borderBottom: 'none', color: '#999' }}>
                    —
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
                    {fmt(cumulativeAfterTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

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
              {showTable ? 'Hide' : 'Show'} year-by-year projection
            </button>

            {showTable && (
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Year</th>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Portfolio Value</th>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>Annual Income</th>
                      <th style={{ ...tdBase, textAlign: 'right', borderBottom: '2px solid #ccc', fontWeight: 700 }}>After-Tax Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.year}>
                        <td style={{ ...tdBase, textAlign: 'right' }}>{row.year}</td>
                        <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(row.portfolioValue)}</td>
                        <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>{fmt(row.annualIncome)}</td>
                        <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(row.afterTax)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Assumes dividends are not reinvested. Portfolio grows at the specified growth rate
            each year. Actual dividend tax rate depends on whether dividends are qualified or
            ordinary, and your tax bracket.
          </p>
        </section>
      </div>
    </Layout>
  );
}

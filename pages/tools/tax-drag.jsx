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

export default function TaxDrag() {
  const [initialInvestment, setInitialInvestment] = useState('50000');
  const [annualContrib, setAnnualContrib] = useState('6000');
  const [years, setYears] = useState('20');
  const [grossReturn, setGrossReturn] = useState('8');
  const [dividendYield, setDividendYield] = useState('2');
  const [dividendTaxRate, setDividendTaxRate] = useState('15');
  const [capitalGainsTaxRate, setCapitalGainsTaxRate] = useState('20');

  const P = Math.max(0, parseFloat(initialInvestment) || 0);
  const C = Math.max(0, parseFloat(annualContrib) || 0);
  const t = Math.max(1, parseFloat(years) || 1);
  const R = (parseFloat(grossReturn) || 0) / 100;
  const divYield = Math.min(R, (parseFloat(dividendYield) || 0) / 100);
  const divTax = (parseFloat(dividendTaxRate) || 0) / 100;
  const cgtRate = (parseFloat(capitalGainsTaxRate) || 0) / 100;

  const capitalAppreciation = R - divYield;

  // Pre-tax scenario: compound at full gross return
  let preTaxBalance = P;
  for (let i = 0; i < t; i++) {
    preTaxBalance = preTaxBalance * (1 + R) + C;
  }
  const preTaxFV = preTaxBalance;
  const preTaxGain = preTaxFV - (P + C * t);

  // After-tax scenario:
  // Each year:
  //   1. Capital appreciation compounds (deferred until sale)
  //   2. Dividends are paid out and taxed each year
  //   3. New contributions are added
  //
  // We track cost basis to compute CGT at end
  let balance = P;
  let costBasis = P;

  for (let yr = 0; yr < t; yr++) {
    // Dividends earned this year (taxed at dividend tax rate)
    const dividends = balance * divYield;
    const dividendsAfterTax = dividends * (1 - divTax);

    // Capital appreciation (deferred)
    const appreciation = balance * capitalAppreciation;

    // New balance: previous + appreciation + dividends after tax + new contribution
    balance = balance + appreciation + dividendsAfterTax + C;

    // Cost basis increases by dividends already taxed (reinvested after-tax) and contributions
    costBasis = costBasis + dividendsAfterTax + C;
  }

  // At end: apply CGT to unrealized gains (balance - cost basis)
  const unrealizedGains = Math.max(0, balance - costBasis);
  const cgtOwed = unrealizedGains * cgtRate;
  const afterTaxFV = balance - cgtOwed;

  const totalContributions = P + C * t;
  const afterTaxGain = afterTaxFV - totalContributions;
  const taxDrag = preTaxFV - afterTaxFV;
  const taxDragPct = preTaxFV > 0 ? (taxDrag / preTaxFV) * 100 : 0;

  // Annual dividend tax cost (average)
  const avgDividendTaxPerYear =
    divYield > 0 ? (P * divYield * divTax + ((P + C * t) / 2) * divYield * divTax) / 2 : 0;

  return (
    <Layout title="Tax Drag on Investment Returns">
      <h1 style={{ marginBottom: '0.25rem' }}>Tax Drag on Investment Returns</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Quantify how annual dividend taxes and capital gains taxes reduce your investment returns
        compared to a fully tax-deferred account.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Investment Details</h2>
          <div style={gridStyle}>
            <Field
              label="Initial investment ($)"
              value={initialInvestment}
              onChange={setInitialInvestment}
            />
            <Field
              label="Annual contribution ($)"
              value={annualContrib}
              onChange={setAnnualContrib}
            />
            <Field label="Years" value={years} onChange={setYears} min="1" />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Returns & Taxes</h2>
          <div style={gridStyle}>
            <Field
              label="Gross annual return (%)"
              value={grossReturn}
              onChange={setGrossReturn}
              step="0.1"
            />
            <Field
              label="Annual dividend yield (% of portfolio)"
              value={dividendYield}
              onChange={setDividendYield}
              step="0.1"
            />
            <Field
              label="Dividend tax rate (%)"
              value={dividendTaxRate}
              onChange={setDividendTaxRate}
              step="0.5"
            />
            <Field
              label="Capital gains tax rate (%) – applied at sale"
              value={capitalGainsTaxRate}
              onChange={setCapitalGainsTaxRate}
              step="0.5"
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
                    Tax-Deferred (Pre-Tax)
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Taxable Account
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Total contributed</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalContributions)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalContributions)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Portfolio value before final tax</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(preTaxFV)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(balance)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>CGT owed at sale</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#999' }}>—</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    {fmt(cgtOwed)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>Final after-tax value</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      fontSize: '1.05rem',
                      color: '#27ae60',
                    }}
                  >
                    {fmt(preTaxFV)}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      fontSize: '1.05rem',
                    }}
                  >
                    {fmt(afterTaxFV)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Net gain after tax</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(preTaxGain)}
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(afterTaxGain)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700 }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Total tax drag over {Math.round(t)} years
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', borderBottom: 'none', color: '#999' }}>
                    —
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color: '#c0392b',
                    }}
                  >
                    {fmt(taxDrag)} ({taxDragPct.toFixed(1)}% of pre-tax value)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual bar */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem', fontWeight: 600 }}>
              After-tax value breakdown
            </div>
            <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', background: '#eee' }}>
              <div
                style={{
                  width: preTaxFV > 0 ? `${(totalContributions / preTaxFV) * 100}%` : '0%',
                  background: '#3498db',
                }}
                title={`Contributions: ${fmt(totalContributions)}`}
              />
              <div
                style={{
                  width: preTaxFV > 0 ? `${(afterTaxGain / preTaxFV) * 100}%` : '0%',
                  background: '#2ecc71',
                }}
                title={`After-tax gain: ${fmt(afterTaxGain)}`}
              />
              <div
                style={{
                  width: preTaxFV > 0 ? `${(taxDrag / preTaxFV) * 100}%` : '0%',
                  background: '#c0392b',
                }}
                title={`Tax drag: ${fmt(taxDrag)}`}
              />
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
              <span>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#3498db', borderRadius: 2, marginRight: 4 }} />
                Contributions {fmt(totalContributions)}
              </span>
              <span>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#2ecc71', borderRadius: 2, marginRight: 4 }} />
                After-tax gain {fmt(afterTaxGain)}
              </span>
              <span>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#c0392b', borderRadius: 2, marginRight: 4 }} />
                Tax drag {fmt(taxDrag)}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Dividends are assumed to be reinvested after-tax each year. Capital gains tax is
            applied once at the end (buy-and-hold strategy). Does not model wash sale rules,
            state taxes, or tax-loss harvesting. Use tax-advantaged accounts (401k, IRA, Roth)
            to eliminate tax drag entirely.
          </p>
        </section>
      </div>
    </Layout>
  );
}

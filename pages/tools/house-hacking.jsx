import { useState } from 'react';
import Layout from '../../components/Layout';

const fmt = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtSigned = (v) =>
  (v >= 0 ? '+' : '') +
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

export default function HouseHacking() {
  const [propertyPrice, setPropertyPrice] = useState('400000');
  const [downPct, setDownPct] = useState('5');
  const [mortgageRate, setMortgageRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');
  const [numUnits, setNumUnits] = useState('2');
  const [rentalIncome, setRentalIncome] = useState('1800');
  const [monthlyExpenses, setMonthlyExpenses] = useState('500');
  const [alternativeRent, setAlternativeRent] = useState('1500');

  const price = Math.max(0, parseFloat(propertyPrice) || 0);
  const down = (price * (parseFloat(downPct) || 0)) / 100;
  const mRate = (parseFloat(mortgageRate) || 0) / 100 / 12;
  const months = (parseFloat(loanTerm) || 30) * 12;
  const units = Math.max(2, Math.round(parseFloat(numUnits) || 2));
  const rental = Math.max(0, parseFloat(rentalIncome) || 0);
  const expenses = Math.max(0, parseFloat(monthlyExpenses) || 0);
  const altRent = Math.max(0, parseFloat(alternativeRent) || 0);

  const principal = price - down;
  const mf =
    mRate === 0
      ? 1 / months
      : (mRate * Math.pow(1 + mRate, months)) / (Math.pow(1 + mRate, months) - 1);
  const mortgagePayment = principal * mf;

  const totalMonthlyOwnerCost = mortgagePayment + expenses;
  const effectiveHousingCost = totalMonthlyOwnerCost - rental;
  const monthlySavings = altRent - effectiveHousingCost;
  const rentalCoversPct = totalMonthlyOwnerCost > 0 ? (rental / totalMonthlyOwnerCost) * 100 : 0;
  const annualSavings = monthlySavings * 12;

  // Break-even: how many units would need to rent to cover 100% of costs
  const rentPerUnit = units > 1 ? rental / (units - 1) : rental;
  const unitsNeededToCover =
    rentPerUnit > 0 ? totalMonthlyOwnerCost / rentPerUnit : Infinity;

  return (
    <Layout title="House Hacking Analyzer">
      <h1 style={{ marginBottom: '0.25rem' }}>House Hacking Analyzer</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Buy a multi-unit property, live in one unit, and rent the others to reduce or eliminate your
        housing cost.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Property & Financing</h2>
          <div style={gridStyle}>
            <Field label="Property price ($)" value={propertyPrice} onChange={setPropertyPrice} />
            <Field label="Down payment (%)" value={downPct} onChange={setDownPct} min="0" />
            <Field
              label="Mortgage interest rate (%)"
              value={mortgageRate}
              onChange={setMortgageRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} min="1" />
            <Field
              label="Total number of units"
              value={numUnits}
              onChange={setNumUnits}
              min="2"
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Income & Expenses</h2>
          <div style={gridStyle}>
            <Field
              label="Monthly rental income from other units ($)"
              value={rentalIncome}
              onChange={setRentalIncome}
            />
            <Field
              label="Monthly property expenses – taxes, insurance, maintenance ($)"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
            />
            <Field
              label="Your alternative monthly rent if not buying ($)"
              value={alternativeRent}
              onChange={setAlternativeRent}
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
                  <td style={tdBase}>Monthly mortgage payment</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(mortgagePayment)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Total monthly owner cost (mortgage + expenses)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalMonthlyOwnerCost)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Rental income from tenants</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(rental)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Rental income covers</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: rentalCoversPct >= 100 ? '#27ae60' : '#e67e22',
                    }}
                  >
                    {rentalCoversPct.toFixed(1)}% of total costs
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>Your effective monthly housing cost</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      fontSize: '1.05rem',
                      color: effectiveHousingCost <= 0 ? '#27ae60' : undefined,
                    }}
                  >
                    {effectiveHousingCost <= 0
                      ? `${fmt(Math.abs(effectiveHousingCost))} surplus`
                      : fmt(effectiveHousingCost)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>vs. renting alternative ({fmt(altRent)}/mo)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: monthlySavings >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmtSigned(monthlySavings)}/mo
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>Annual savings vs. renting</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color: annualSavings >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmtSigned(annualSavings)}/yr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {effectiveHousingCost <= 0 && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem 1.25rem',
                background: '#e8f5e9',
                border: '1px solid #a5d6a7',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Your tenants cover 100% of your costs — you live for free and pocket{' '}
              {fmt(Math.abs(effectiveHousingCost))}/month surplus!
            </div>
          )}

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Does not include closing costs, vacancy, capital expenditures, or income taxes on
            rental income. Principal paydown and property appreciation are additional wealth-building
            benefits not reflected here.
          </p>
        </section>
      </div>
    </Layout>
  );
}

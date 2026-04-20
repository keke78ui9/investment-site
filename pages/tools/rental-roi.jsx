import { useState } from 'react';
import Layout from '../../components/Layout';

const fmt = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtPct = (v) => v.toFixed(2) + '%';

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

export default function RentalROI() {
  const [purchasePrice, setPurchasePrice] = useState('300000');
  const [downPct, setDownPct] = useState('20');
  const [closingCosts, setClosingCosts] = useState('6000');
  const [rehabCost, setRehabCost] = useState('10000');
  const [monthlyRent, setMonthlyRent] = useState('2200');
  const [vacancyRate, setVacancyRate] = useState('5');
  const [monthlyExpenses, setMonthlyExpenses] = useState('600');
  const [mortgageRate, setMortgageRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');

  const price = Math.max(0, parseFloat(purchasePrice) || 0);
  const down = (price * (parseFloat(downPct) || 0)) / 100;
  const closing = Math.max(0, parseFloat(closingCosts) || 0);
  const rehab = Math.max(0, parseFloat(rehabCost) || 0);
  const rent = Math.max(0, parseFloat(monthlyRent) || 0);
  const vacancy = (parseFloat(vacancyRate) || 0) / 100;
  const expenses = Math.max(0, parseFloat(monthlyExpenses) || 0);
  const mRate = (parseFloat(mortgageRate) || 0) / 100 / 12;
  const months = (parseFloat(loanTerm) || 30) * 12;

  const principal = price - down;
  const mf =
    mRate === 0
      ? 1 / months
      : (mRate * Math.pow(1 + mRate, months)) / (Math.pow(1 + mRate, months) - 1);
  const mortgagePayment = principal * mf;

  const totalCashInvested = down + closing + rehab;
  const effectiveAnnualRent = rent * 12 * (1 - vacancy);
  const annualExpenses = expenses * 12;
  const annualMortgage = mortgagePayment * 12;

  const noi = effectiveAnnualRent - annualExpenses;
  const annualCashFlow = noi - annualMortgage;
  const monthlyCashFlow = annualCashFlow / 12;

  const capRate = price > 0 ? (noi / price) * 100 : 0;
  const cashOnCash = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;
  const grm = rent > 0 ? price / (rent * 12) : 0;
  const grossYield = price > 0 ? ((rent * 12) / price) * 100 : 0;

  return (
    <Layout title="Rental Property ROI Calculator">
      <h1 style={{ marginBottom: '0.25rem' }}>Rental Property ROI Calculator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Analyze cap rate, cash-on-cash return, and monthly cash flow for a rental property
        investment.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Purchase & Costs</h2>
          <div style={gridStyle}>
            <Field label="Purchase price ($)" value={purchasePrice} onChange={setPurchasePrice} />
            <Field label="Down payment (%)" value={downPct} onChange={setDownPct} min="0" />
            <Field label="Closing costs ($)" value={closingCosts} onChange={setClosingCosts} />
            <Field label="Rehab / repair costs ($)" value={rehabCost} onChange={setRehabCost} />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Income & Expenses</h2>
          <div style={gridStyle}>
            <Field label="Monthly gross rent ($)" value={monthlyRent} onChange={setMonthlyRent} />
            <Field
              label="Vacancy rate (%)"
              value={vacancyRate}
              onChange={setVacancyRate}
              step="0.5"
            />
            <Field
              label="Monthly operating expenses – taxes, insurance, maintenance, PM ($)"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Financing</h2>
          <div style={gridStyle}>
            <Field
              label="Mortgage interest rate (%)"
              value={mortgageRate}
              onChange={setMortgageRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} min="1" />
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
                  <td style={tdBase}>Total cash invested (down + closing + rehab)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalCashInvested)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly mortgage payment</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(mortgagePayment)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Effective annual rent (after vacancy)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(effectiveAnnualRent)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Net Operating Income (NOI)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: noi >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmt(noi)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly cash flow (after mortgage)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: monthlyCashFlow >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmt(monthlyCashFlow)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Cap rate</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: capRate >= 5 ? '#27ae60' : '#e67e22',
                    }}
                  >
                    {fmtPct(capRate)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Cash-on-cash return</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: cashOnCash >= 8 ? '#27ae60' : cashOnCash >= 0 ? '#e67e22' : '#c0392b',
                    }}
                  >
                    {fmtPct(cashOnCash)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Gross rent multiplier (GRM)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{grm.toFixed(1)}x</td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>Gross yield</td>
                  <td style={{ ...tdBase, textAlign: 'right', borderBottom: 'none' }}>
                    {fmtPct(grossYield)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Cap rate = NOI ÷ purchase price. Cash-on-cash = annual cash flow ÷ total cash invested.
            Does not account for property appreciation, depreciation tax benefits, or principal
            paydown.
          </p>
        </section>
      </div>
    </Layout>
  );
}

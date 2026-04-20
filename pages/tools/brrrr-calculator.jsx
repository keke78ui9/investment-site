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

export default function BRRRRCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('150000');
  const [rehabCost, setRehabCost] = useState('40000');
  const [arv, setArv] = useState('250000');
  const [refinanceLtv, setRefinanceLtv] = useState('75');
  const [refinanceRate, setRefinanceRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyRent, setMonthlyRent] = useState('1800');
  const [monthlyExpenses, setMonthlyExpenses] = useState('450');

  const purchase = Math.max(0, parseFloat(purchasePrice) || 0);
  const rehab = Math.max(0, parseFloat(rehabCost) || 0);
  const afterRepairValue = Math.max(0, parseFloat(arv) || 0);
  const ltvPct = (parseFloat(refinanceLtv) || 0) / 100;
  const mRate = (parseFloat(refinanceRate) || 0) / 100 / 12;
  const months = (parseFloat(loanTerm) || 30) * 12;
  const rent = Math.max(0, parseFloat(monthlyRent) || 0);
  const expenses = Math.max(0, parseFloat(monthlyExpenses) || 0);

  const totalCashIn = purchase + rehab;
  const refinanceLoan = afterRepairValue * ltvPct;
  const cashReturned = Math.min(refinanceLoan, totalCashIn);
  const cashLeftIn = totalCashIn - cashReturned;
  const equity = afterRepairValue - refinanceLoan;

  const mf =
    mRate === 0
      ? 1 / months
      : (mRate * Math.pow(1 + mRate, months)) / (Math.pow(1 + mRate, months) - 1);
  const newMortgagePayment = refinanceLoan * mf;

  const monthlyCashFlow = rent - expenses - newMortgagePayment;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCash = cashLeftIn > 0 ? (annualCashFlow / cashLeftIn) * 100 : Infinity;
  const isTrueBRRRR = cashLeftIn <= 0;

  return (
    <Layout title="BRRRR Calculator">
      <h1 style={{ marginBottom: '0.25rem' }}>BRRRR Calculator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Buy, Rehab, Rent, Refinance, Repeat — analyze whether your deal lets you pull all your
        capital back out while retaining a cash-flowing rental.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Acquisition & Rehab</h2>
          <div style={gridStyle}>
            <Field label="Purchase price ($)" value={purchasePrice} onChange={setPurchasePrice} />
            <Field label="Rehab cost ($)" value={rehabCost} onChange={setRehabCost} />
            <Field
              label="After-repair value – ARV ($)"
              value={arv}
              onChange={setArv}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Refinance</h2>
          <div style={gridStyle}>
            <Field
              label="Refinance LTV (%)"
              value={refinanceLtv}
              onChange={setRefinanceLtv}
              step="0.5"
              min="0"
            />
            <Field
              label="New interest rate (%)"
              value={refinanceRate}
              onChange={setRefinanceRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} min="1" />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Rental Income</h2>
          <div style={gridStyle}>
            <Field label="Monthly rent ($)" value={monthlyRent} onChange={setMonthlyRent} />
            <Field
              label="Monthly expenses – taxes, insurance, maintenance ($)"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
            />
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: '1rem' }}>Results</h2>

          {isTrueBRRRR && (
            <div
              style={{
                padding: '0.9rem 1.1rem',
                background: '#e8f5e9',
                border: '1px solid #a5d6a7',
                borderRadius: 8,
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              True BRRRR achieved — you pulled out all {fmt(totalCashIn)} of your invested capital
              and still own a cash-flowing rental with {fmt(equity)} in equity!
            </div>
          )}

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
                  <td style={tdBase}>Total cash invested (purchase + rehab)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalCashIn)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Refinance loan amount ({refinanceLtv}% of ARV)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(refinanceLoan)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Cash returned at refinance</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(cashReturned)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700 }}>
                  <td style={tdBase}>Cash left in deal</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: cashLeftIn <= 0 ? '#27ae60' : '#e67e22',
                    }}
                  >
                    {cashLeftIn <= 0 ? `${fmt(Math.abs(cashLeftIn))} surplus` : fmt(cashLeftIn)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Equity at refinance (ARV – loan)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(equity)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>New monthly mortgage payment</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(newMortgagePayment)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly cash flow</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: monthlyCashFlow >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmtSigned(monthlyCashFlow)}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>Cash-on-cash return</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color:
                        cashOnCash === Infinity
                          ? '#27ae60'
                          : cashOnCash >= 8
                          ? '#27ae60'
                          : '#e67e22',
                    }}
                  >
                    {cashOnCash === Infinity ? '∞ (True BRRRR)' : cashOnCash.toFixed(2) + '%'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Does not include closing costs, carrying costs during rehab, seasoning periods, or taxes.
            Refinance availability depends on lender requirements and local appraisal.
          </p>
        </section>
      </div>
    </Layout>
  );
}

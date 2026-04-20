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

export default function MortgageAffordability() {
  const [annualIncome, setAnnualIncome] = useState('100000');
  const [monthlyDebts, setMonthlyDebts] = useState('500');
  const [downPayment, setDownPayment] = useState('60000');
  const [interestRate, setInterestRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.2');
  const [monthlyInsurance, setMonthlyInsurance] = useState('150');

  const income = Math.max(0, parseFloat(annualIncome) || 0);
  const debts = Math.max(0, parseFloat(monthlyDebts) || 0);
  const down = Math.max(0, parseFloat(downPayment) || 0);
  const rate = (parseFloat(interestRate) || 0) / 100 / 12;
  const months = (parseFloat(loanTerm) || 30) * 12;
  const taxRate = (parseFloat(propertyTaxRate) || 0) / 100;
  const insurance = Math.max(0, parseFloat(monthlyInsurance) || 0);

  const monthlyIncome = income / 12;
  const maxHousingFront = monthlyIncome * 0.28;
  const maxHousingBack = monthlyIncome * 0.43 - debts;
  const maxHousing = Math.min(maxHousingFront, maxHousingBack);

  let maxLoan = 0;
  const mf =
    rate === 0
      ? 1 / months
      : (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

  const denominator = mf + taxRate / 12;
  if (denominator > 0) {
    maxLoan = Math.max(0, (maxHousing - insurance - (down * taxRate) / 12) / denominator);
  }

  const maxHomePrice = maxLoan + down;
  const monthlyPI = maxLoan * mf;
  const monthlyTax = maxHomePrice * taxRate / 12;
  const totalMonthly = monthlyPI + monthlyTax + insurance;
  const backEndDTI = monthlyIncome > 0 ? ((totalMonthly + debts) / monthlyIncome) * 100 : 0;
  const frontEndDTI = monthlyIncome > 0 ? (totalMonthly / monthlyIncome) * 100 : 0;

  return (
    <Layout title="Mortgage Affordability Calculator">
      <h1 style={{ marginBottom: '0.25rem' }}>Mortgage Affordability Calculator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Estimate the maximum home price you can afford based on income, existing debts, and down
        payment using standard 28/43 DTI guidelines.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Your Finances</h2>
          <div style={gridStyle}>
            <Field label="Annual gross income ($)" value={annualIncome} onChange={setAnnualIncome} />
            <Field
              label="Existing monthly debt payments ($)"
              value={monthlyDebts}
              onChange={setMonthlyDebts}
            />
            <Field
              label="Down payment available ($)"
              value={downPayment}
              onChange={setDownPayment}
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Loan & Property Details</h2>
          <div style={gridStyle}>
            <Field
              label="Mortgage interest rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              step="0.1"
            />
            <Field label="Loan term (years)" value={loanTerm} onChange={setLoanTerm} min="1" />
            <Field
              label="Annual property tax rate (%)"
              value={propertyTaxRate}
              onChange={setPropertyTaxRate}
              step="0.1"
            />
            <Field
              label="Monthly homeowner's insurance ($)"
              value={monthlyInsurance}
              onChange={setMonthlyInsurance}
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
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase }}>Maximum home price</td>
                  <td style={{ ...tdBase, textAlign: 'right', fontSize: '1.05rem', color: '#27ae60' }}>
                    {fmt(maxHomePrice)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Maximum loan amount</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(maxLoan)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly principal & interest</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(monthlyPI)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly property tax</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(monthlyTax)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Monthly insurance</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(insurance)}</td>
                </tr>
                <tr style={{ fontWeight: 700 }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Total monthly payment (PITI)
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', borderBottom: 'none' }}>
                    {fmt(totalMonthly)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Front-end DTI (housing / income)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: frontEndDTI > 28 ? '#c0392b' : '#27ae60',
                    }}
                  >
                    {frontEndDTI.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Back-end DTI (all debts / income)
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color: backEndDTI > 43 ? '#c0392b' : '#27ae60',
                    }}
                  >
                    {backEndDTI.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Based on 28% front-end DTI (housing costs ÷ gross income) and 43% back-end DTI (all
            debts ÷ gross income) guidelines. Does not include PMI, HOA fees, or utilities. Actual
            approval depends on credit score and lender policies.
          </p>
        </section>
      </div>
    </Layout>
  );
}

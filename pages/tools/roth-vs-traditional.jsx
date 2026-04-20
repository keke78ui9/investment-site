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

export default function RothVsTraditional() {
  const [annualContrib, setAnnualContrib] = useState('7000');
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentTaxRate, setCurrentTaxRate] = useState('22');
  const [retirementTaxRate, setRetirementTaxRate] = useState('15');
  const [annualReturn, setAnnualReturn] = useState('7');

  const contrib = Math.max(0, parseFloat(annualContrib) || 0);
  const cAge = Math.max(1, parseFloat(currentAge) || 30);
  const rAge = Math.max(cAge + 1, parseFloat(retirementAge) || 65);
  const currentTax = (parseFloat(currentTaxRate) || 0) / 100;
  const retirementTax = (parseFloat(retirementTaxRate) || 0) / 100;
  const r = (parseFloat(annualReturn) || 0) / 100;

  const years = rAge - cAge;

  // Future value factor for annual contributions (end-of-year)
  const fvFactor = r === 0 ? years : ((Math.pow(1 + r, years) - 1) / r) * (1 + r);

  // Traditional IRA: contribute pre-tax amount, grow, pay retirement tax on withdrawal
  const traditionalFVGross = contrib * fvFactor;
  const traditionalAfterTax = traditionalFVGross * (1 - retirementTax);
  // Tax savings now (if invested, what it grows to)
  const taxSavingsNow = contrib * currentTax;
  const taxSavingsFV = taxSavingsNow * fvFactor;

  // Roth IRA: contribute after-tax amount (you pay current tax first), grows tax-free
  const rothAfterTaxContrib = contrib * (1 - currentTax);
  const rothFV = rothAfterTaxContrib * fvFactor;

  // Equivalent comparison:
  // Option A: Roth - contribute $X after-tax to Roth, withdraw all tax-free
  // Option B: Traditional - contribute $X pre-tax, withdraw at retirement tax rate
  //   But wait: if contributing same $X to both (common comparison):
  //   - Traditional: X grows to X*fvFactor, you withdraw (1-t_r) portion = X*fvFactor*(1-t_r)
  //   - Roth: X*(1-t_c) grows, you withdraw everything = X*(1-t_c)*fvFactor
  //   Roth wins if t_c < t_r (pay taxes now when rate is lower)
  //   Traditional wins if t_c > t_r (pay taxes later when rate is lower)

  // Traditional with same after-tax cost (fair comparison):
  // You'd contribute X/(1-t_c) to traditional for same out-of-pocket as X to Roth
  const fairTraditionalContrib = contrib / (1 - currentTax);
  const fairTraditionalFVGross = fairTraditionalContrib * fvFactor;
  const fairTraditionalAfterTax = fairTraditionalFVGross * (1 - retirementTax);

  const winner =
    fairTraditionalAfterTax > rothFV ? 'traditional' : rothFV > fairTraditionalAfterTax ? 'roth' : 'tie';
  const difference = Math.abs(fairTraditionalAfterTax - rothFV);

  return (
    <Layout title="Roth vs. Traditional IRA Comparison">
      <h1 style={{ marginBottom: '0.25rem' }}>Roth vs. Traditional IRA</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Compare the after-tax wealth of a Roth IRA (pay taxes now, withdraw tax-free) vs. a
        Traditional IRA (deduct now, pay taxes at retirement).
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Contribution Details</h2>
          <div style={gridStyle}>
            <Field
              label="Annual IRA contribution ($)"
              value={annualContrib}
              onChange={setAnnualContrib}
            />
            <Field
              label="Current age"
              value={currentAge}
              onChange={setCurrentAge}
              min="1"
            />
            <Field
              label="Retirement age"
              value={retirementAge}
              onChange={setRetirementAge}
              min="1"
            />
            <Field
              label="Current marginal tax rate (%)"
              value={currentTaxRate}
              onChange={setCurrentTaxRate}
              step="0.5"
            />
            <Field
              label="Expected retirement tax rate (%)"
              value={retirementTaxRate}
              onChange={setRetirementTaxRate}
              step="0.5"
            />
            <Field
              label="Expected annual return (%)"
              value={annualReturn}
              onChange={setAnnualReturn}
              step="0.1"
            />
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
                    Roth IRA
                  </th>
                  <th
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: '2px solid #ccc',
                      fontWeight: 700,
                    }}
                  >
                    Traditional IRA
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdBase}>Annual contribution (same out-of-pocket)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(contrib)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(fairTraditionalContrib)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Tax treatment of contributions</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    After-tax ({currentTaxRate}% now)
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    Pre-tax (deductible)
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>
                    Gross portfolio value after {years} years
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(rothFV)}</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(fairTraditionalFVGross)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Tax owed at withdrawal</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>None</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    {fmt(fairTraditionalFVGross - fairTraditionalAfterTax)} ({retirementTaxRate}%)
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    After-tax wealth at retirement
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: winner === 'roth' ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(rothFV)}
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      fontSize: '1.05rem',
                      color: winner === 'traditional' ? '#27ae60' : undefined,
                    }}
                  >
                    {fmt(fairTraditionalAfterTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: winner === 'roth' ? '#e8f5e9' : winner === 'traditional' ? '#e3f2fd' : '#f5f5f5',
              border: `1px solid ${winner === 'roth' ? '#a5d6a7' : winner === 'traditional' ? '#90caf9' : '#ccc'}`,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {winner === 'tie'
              ? 'Both options produce the same after-tax wealth when tax rates are equal.'
              : winner === 'roth'
              ? `Roth IRA wins by ${fmt(difference)} — your tax rate is expected to be higher in retirement (${retirementTaxRate}%) than now (${currentTaxRate}%), so pay taxes now.`
              : `Traditional IRA wins by ${fmt(difference)} — your tax rate is expected to be lower in retirement (${retirementTaxRate}%) than now (${currentTaxRate}%), so defer taxes.`}
          </div>

          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Fair comparison assumes same after-tax out-of-pocket cost: Roth contribution is {fmt(contrib)},
            Traditional is {fmt(fairTraditionalContrib)} (grossed up for current taxes). Subject to IRS
            contribution limits and income phase-outs. Roth also offers no required minimum distributions
            and more flexibility — factors not captured here.
          </p>
        </section>
      </div>
    </Layout>
  );
}

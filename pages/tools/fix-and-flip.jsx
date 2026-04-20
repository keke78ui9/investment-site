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

export default function FixAndFlip() {
  const [purchasePrice, setPurchasePrice] = useState('180000');
  const [rehabCost, setRehabCost] = useState('35000');
  const [holdingCosts, setHoldingCosts] = useState('1500');
  const [holdingMonths, setHoldingMonths] = useState('6');
  const [sellingCostsPct, setSellingCostsPct] = useState('8');
  const [arv, setArv] = useState('300000');

  const purchase = Math.max(0, parseFloat(purchasePrice) || 0);
  const rehab = Math.max(0, parseFloat(rehabCost) || 0);
  const holding = Math.max(0, parseFloat(holdingCosts) || 0);
  const holdMonths = Math.max(1, parseFloat(holdingMonths) || 1);
  const sellingPct = (parseFloat(sellingCostsPct) || 0) / 100;
  const afterRepairValue = Math.max(0, parseFloat(arv) || 0);

  const totalHoldingCosts = holding * holdMonths;
  const sellingCosts = afterRepairValue * sellingPct;
  const totalCost = purchase + rehab + totalHoldingCosts + sellingCosts;

  const grossProfit = afterRepairValue - purchase - rehab;
  const netProfit = afterRepairValue - totalCost;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const annualizedROI =
    totalCost > 0 ? (Math.pow(1 + netProfit / totalCost, 12 / holdMonths) - 1) * 100 : 0;

  return (
    <Layout title="Fix & Flip Profit Estimator">
      <h1 style={{ marginBottom: '0.25rem' }}>Fix & Flip Profit Estimator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Calculate your net profit, ROI, and annualized return on a fix-and-flip project before you
        buy.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Costs</h2>
          <div style={gridStyle}>
            <Field label="Purchase price ($)" value={purchasePrice} onChange={setPurchasePrice} />
            <Field label="Rehab / renovation cost ($)" value={rehabCost} onChange={setRehabCost} />
            <Field
              label="Monthly holding costs – loan, utilities, taxes ($)"
              value={holdingCosts}
              onChange={setHoldingCosts}
            />
            <Field
              label="Holding period (months)"
              value={holdingMonths}
              onChange={setHoldingMonths}
              min="1"
            />
            <Field
              label="Selling costs (% of ARV) – agent, closing, taxes"
              value={sellingCostsPct}
              onChange={setSellingCostsPct}
              step="0.5"
            />
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Sale</h2>
          <div style={{ maxWidth: 220 }}>
            <Field
              label="After-repair value – ARV ($)"
              value={arv}
              onChange={setArv}
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
                  <td style={tdBase}>Purchase price</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(purchase)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Rehab cost</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(rehab)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>
                    Total holding costs ({holdMonths} mo × {fmt(holding)})
                  </td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(totalHoldingCosts)}</td>
                </tr>
                <tr>
                  <td style={tdBase}>Selling costs ({sellingCostsPct}% of ARV)</td>
                  <td style={{ ...tdBase, textAlign: 'right' }}>{fmt(sellingCosts)}</td>
                </tr>
                <tr style={{ fontWeight: 700 }}>
                  <td style={tdBase}>Total all-in cost</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#c0392b' }}>
                    {fmt(totalCost)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>After-repair value (ARV)</td>
                  <td style={{ ...tdBase, textAlign: 'right', color: '#27ae60' }}>
                    {fmt(afterRepairValue)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Gross profit (ARV – purchase – rehab)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: grossProfit >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmt(grossProfit)}
                  </td>
                </tr>
                <tr style={{ fontWeight: 700, background: '#f5f5f5' }}>
                  <td style={tdBase}>Net profit (ARV – all-in cost)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      fontSize: '1.05rem',
                      color: netProfit >= 0 ? '#27ae60' : '#c0392b',
                    }}
                  >
                    {fmt(netProfit)}
                  </td>
                </tr>
                <tr>
                  <td style={tdBase}>Return on investment (ROI)</td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      color: roi >= 15 ? '#27ae60' : roi >= 0 ? '#e67e22' : '#c0392b',
                    }}
                  >
                    {roi.toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdBase, borderBottom: 'none' }}>
                    Annualized ROI (over {holdMonths} months)
                  </td>
                  <td
                    style={{
                      ...tdBase,
                      textAlign: 'right',
                      borderBottom: 'none',
                      color:
                        annualizedROI >= 20 ? '#27ae60' : annualizedROI >= 0 ? '#e67e22' : '#c0392b',
                    }}
                  >
                    {annualizedROI.toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '1rem', lineHeight: 1.5 }}>
            Does not include income taxes on profit, financing origination fees, or unexpected
            rehab overruns. The 70% rule of thumb: max purchase price = ARV × 70% − rehab costs.
          </p>
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.9rem 1.1rem',
              background: '#f0f0f0',
              borderRadius: 8,
              fontSize: '0.9rem',
            }}
          >
            <strong>70% Rule check:</strong> Max offer price ={' '}
            {fmt(afterRepairValue * 0.7 - rehab)}
            {purchase <= afterRepairValue * 0.7 - rehab ? (
              <span style={{ color: '#27ae60', marginLeft: 8 }}>✓ Under 70% rule</span>
            ) : (
              <span style={{ color: '#c0392b', marginLeft: 8 }}>✗ Over 70% rule</span>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

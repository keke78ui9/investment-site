import { useState } from 'react';
import Layout from '../../components/Layout';

// Migrate your existing rental-vs-mortgage logic here.
// All calculations are pure client-side — no server needed.

export default function RentalVsMortgage() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(7);
  const [termYears, setTermYears] = useState(30);
  const [rent, setRent] = useState(2000);

  const downPayment = (homePrice * downPct) / 100;
  const principal = homePrice - downPayment;
  const monthlyRate = rate / 100 / 12;
  const n = termYears * 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / n
      : (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
        (Math.pow(1 + monthlyRate, n) - 1);

  return (
    <Layout title="Rent vs. Mortgage Calculator">
      <h1>Rent vs. Mortgage Calculator</h1>

      <section>
        <label>
          Home price: ${homePrice.toLocaleString()}
          <br />
          <input
            type="range"
            min={100000}
            max={2000000}
            step={10000}
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
          />
        </label>

        <label>
          Down payment: {downPct}%
          <br />
          <input
            type="range"
            min={3}
            max={50}
            step={1}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
          />
        </label>

        <label>
          Interest rate: {rate}%
          <br />
          <input
            type="range"
            min={1}
            max={15}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </label>

        <label>
          Loan term: {termYears} years
          <br />
          <input
            type="range"
            min={10}
            max={30}
            step={5}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
          />
        </label>

        <label>
          Monthly rent: ${rent.toLocaleString()}
          <br />
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={rent}
            onChange={(e) => setRent(Number(e.target.value))}
          />
        </label>
      </section>

      <section>
        <h2>Results</h2>
        <p>
          <strong>Monthly mortgage payment:</strong> $
          {monthlyPayment.toFixed(2)}
        </p>
        <p>
          <strong>Down payment:</strong> ${downPayment.toLocaleString()}
        </p>
        <p>
          <strong>Mortgage vs. rent:</strong>{' '}
          {monthlyPayment > rent
            ? `Mortgage costs $${(monthlyPayment - rent).toFixed(0)}/mo more`
            : `Rent costs $${(rent - monthlyPayment).toFixed(0)}/mo more`}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Note: does not include taxes, insurance, HOA, maintenance, or
          opportunity cost on down payment. Migrate your full logic here.
        </p>
      </section>
    </Layout>
  );
}

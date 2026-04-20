import Link from 'next/link';
import Layout from '../../components/Layout';

const categories = [
  {
    name: 'Real Estate',
    tools: [
      {
        href: '/tools/rental-vs-mortgage',
        title: 'Rental Property: Cash vs. Mortgage',
        description: 'Compare paying cash vs. financing a rental property and its impact on net worth.',
      },
      {
        href: '/tools/mortgage-affordability',
        title: 'Mortgage Affordability Calculator',
        description: 'Estimate the maximum home price you can afford based on income, debts, and down payment.',
      },
      {
        href: '/tools/rental-roi',
        title: 'Rental Property ROI Calculator',
        description: 'Analyze cap rate, cash-on-cash return, and monthly cash flow for a rental property.',
      },
      {
        href: '/tools/house-hacking',
        title: 'House Hacking Analyzer',
        description: 'Buy a multi-unit, live in one unit, and use tenant rent to offset your housing cost.',
      },
      {
        href: '/tools/brrrr-calculator',
        title: 'BRRRR Calculator',
        description: 'Buy, Rehab, Rent, Refinance, Repeat — see if you can pull all your capital back out.',
      },
      {
        href: '/tools/fix-and-flip',
        title: 'Fix & Flip Profit Estimator',
        description: 'Calculate net profit, ROI, and annualized return on a fix-and-flip project.',
      },
      {
        href: '/tools/ltv-equity',
        title: 'LTV & Equity Tracker',
        description: 'Track how your loan-to-value ratio decreases and equity builds over time.',
      },
    ],
  },
  {
    name: 'Stock & Portfolio',
    tools: [
      {
        href: '/tools/compound-interest',
        title: 'Compound Interest Calculator',
        description: 'See how your money grows over time with compound interest and regular contributions.',
      },
      {
        href: '/tools/dca-simulator',
        title: 'Dollar-Cost Averaging Simulator',
        description: 'Compare investing a fixed monthly amount (DCA) vs. investing a lump sum on day one.',
      },
      {
        href: '/tools/dividend-income',
        title: 'Dividend Yield & Income Estimator',
        description: 'Project current and future dividend income from your portfolio, after taxes.',
      },
      {
        href: '/tools/portfolio-allocation',
        title: 'Portfolio Allocation Visualizer',
        description: 'Visualize your asset allocation and compare it against model portfolios.',
      },
    ],
  },
  {
    name: 'Retirement & FIRE',
    tools: [
      {
        href: '/tools/fire-number',
        title: 'FIRE Number Calculator',
        description: 'Calculate your Financial Independence number and how long it will take to reach it.',
      },
      {
        href: '/tools/retirement-savings',
        title: 'Retirement Savings Goal Tracker',
        description: 'Check if you\'re on track for retirement and what monthly savings closes any gap.',
      },
      {
        href: '/tools/roth-vs-traditional',
        title: 'Roth vs. Traditional IRA Comparison',
        description: 'Compare after-tax wealth between a Roth IRA and a Traditional IRA.',
      },
    ],
  },
  {
    name: 'Debt & Leverage',
    tools: [
      {
        href: '/tools/debt-payoff',
        title: 'Debt Payoff Optimizer',
        description: 'Compare Avalanche (lowest interest) vs. Snowball (smallest balance) payoff strategies.',
      },
      {
        href: '/tools/loan-amortization',
        title: 'Loan Amortization Table',
        description: 'See exactly how each payment is split between principal and interest over the loan term.',
      },
    ],
  },
  {
    name: 'General',
    tools: [
      {
        href: '/tools/inflation-calculator',
        title: 'Inflation Purchasing Power Calculator',
        description: 'See how inflation erodes purchasing power and how much you\'ll need in the future.',
      },
      {
        href: '/tools/net-worth',
        title: 'Net Worth Snapshot Builder',
        description: 'Calculate your net worth by entering assets and liabilities with a visual breakdown.',
      },
      {
        href: '/tools/tax-drag',
        title: 'Tax Drag on Investment Returns',
        description: 'Quantify how dividend and capital gains taxes reduce returns vs. a tax-deferred account.',
      },
    ],
  },
];

const cardStyle = {
  display: 'block',
  padding: '1rem 1.25rem',
  background: '#f9f9f9',
  border: '1px solid #e0e0e0',
  borderRadius: 10,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

export default function ToolsIndex() {
  return (
    <Layout title="Investment Tools">
      <h1 style={{ marginBottom: '0.25rem' }}>Investment Tools</h1>
      <p style={{ color: '#666', marginBottom: '2.5rem' }}>
        A collection of calculators and analyzers to help you make smarter investment decisions.
      </p>

      <div style={{ display: 'grid', gap: '2.5rem' }}>
        {categories.map((cat) => (
          <section key={cat.name}>
            <h2
              style={{
                marginBottom: '1rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e0e0e0',
              }}
            >
              {cat.name}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {cat.tools.map((tool) => (
                <Link key={tool.href} href={tool.href} style={cardStyle}>
                  <div style={{ fontWeight: 600, marginBottom: '0.35rem', color: '#333' }}>
                    {tool.title}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#666', lineHeight: 1.5 }}>
                    {tool.description}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
}

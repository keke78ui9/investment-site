import Link from 'next/link';
import Layout from '../../components/Layout';

const tools = [
  {
    href: '/tools/rental-vs-mortgage',
    title: 'Rent vs. Mortgage Calculator',
    description: 'Compare the true cost of renting against buying a home.',
  },
];

export default function ToolsIndex() {
  return (
    <Layout title="Tools">
      <h1>Tools</h1>
      <ul>
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link href={tool.href}>{tool.title}</Link>
            <p>{tool.description}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

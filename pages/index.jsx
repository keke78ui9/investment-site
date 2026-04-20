import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <h1>Investment Tools &amp; Insights</h1>
      <p>Free tools and analysis to help you make better financial decisions.</p>
      <ul>
        <li><Link href="/tools">Tools</Link> — calculators and screeners</li>
        <li><Link href="/blog">Blog</Link> — articles and analysis</li>
      </ul>
    </Layout>
  );
}

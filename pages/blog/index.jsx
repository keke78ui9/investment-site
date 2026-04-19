import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../../components/Layout';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export default function BlogIndex({ posts }) {
  return (
    <Layout title="Blog">
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            <span style={{ color: '#666', marginLeft: '0.5rem' }}>
              {post.date}
            </span>
            {post.description && <p>{post.description}</p>}
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
    const { data } = matter(raw);
    return { slug, title: data.title ?? slug, date: data.date ?? '', description: data.description ?? '' };
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return { props: { posts } };
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Layout from '../../components/Layout';

const POSTS_DIR = path.join(process.cwd(), 'posts');

export default function BlogPost({ source, frontmatter }) {
  return (
    <Layout title={frontmatter.title}>
      <article>
        <h1>{frontmatter.title}</h1>
        {frontmatter.date && (
          <p style={{ color: '#666', marginTop: 0 }}>{frontmatter.date}</p>
        )}
        <MDXRemote {...source} />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
  const paths = files.map((f) => ({ params: { slug: f.replace(/\.mdx$/, '') } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(POSTS_DIR, `${params.slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(raw);
  const mdxSource = await serialize(content);
  return { props: { source: mdxSource, frontmatter: data } };
}

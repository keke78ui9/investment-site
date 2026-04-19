import Head from 'next/head';
import Nav from './Nav';

export default function Layout({ title, children }) {
  const pageTitle = title ? `${title} — InvestSite` : 'InvestSite';
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
      </Head>
      <Nav />
      <main>{children}</main>
    </>
  );
}

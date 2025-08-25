import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Plataforma Web</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>Plataforma Web</h1>
        <p>Bienvenido. Esta es la base del proyecto Next.js + TypeScript.</p>
        <ul>
          <li>
            <Link href="/api/health">/api/health</Link>
          </li>
          <li>
            <Link href="/api/leads">/api/leads</Link>
          </li>
        </ul>
      </main>
    </>
  );
}

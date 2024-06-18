import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Nav } from 'rsuite'
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import { LANGUAGES, T } from '../I18n/'

export async function getServerSideProps(context) {
  const { locale } = context;
  return {props: { META: T[locale].META, _locale: locale }, };
}

export default function Home({ META, _locale }) {
  const { locale } = useRouter()

  return (
    <div className={`${styles.container} overflow-auto`} style={{
      maxHeight: "calc( 100vh - 3em )",
    }}>
      <Head>
        <title>{T[locale].probabilitySims}</title>
        <meta name="description" content={META.description} />
        {/* <meta name="robots" content="max-image-preview:large" /> */}
        {/* <meta name="google-site-verification" content="x-ogT_BBzMxix0xrb_Mv8YHMUk3x1PTPt88g-2Fi3FU" /> */}
        <meta property="og:locale" content={_locale} />
        <meta property="og:site_name" content={META.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:url" content="https://portfolio.71walceli.beauty/probability-simulators/" />
        {/* <meta property="og:image" content="https://portfolio.71walceli.beauty/wp-content/uploads/2024/05/Profile-Picture.jpg" />
        <meta property="og:image:secure_url" content="https://portfolio.71walceli.beauty/wp-content/uploads/2024/05/Profile-Picture.jpg" /> */}
        {/* <meta property="og:image:width" content="434" />
        <meta property="og:image:height" content="470" /> */}
        {/* <meta property="article:published_time" content="2024-05-04T02:32:28+00:00" />
        <meta property="article:modified_time" content="2024-05-06T21:16:12+00:00" /> */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
        {/* <meta name="twitter:image" content="https://portfolio.71walceli.beauty/wp-content/uploads/2024/05/Profile-Picture.jpg" /> */}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${styles.main}`}>
        <main>
          <h1 className={styles.title}>{T[locale].probabilitySims}</h1>
          <p className="text-center text-sm">{META.description}</p>
          <div className={styles.grid}>
            {T[locale].metaList.map(link => (
              <a key={link.url} href={link.url} className={styles.card}>
                <h2>{link.abbreviation} &rarr;</h2>
                <p>{link.title}</p>
              </a>
            ))}
          </div>
        </main>
        <footer className={styles.footer}>
          <Nav>
            {LANGUAGES.map(l => <Nav.Item key={l.code} as={Link} href={`/${l.code}`}>{l.name}</Nav.Item>)}
          </Nav>
          <span className='m-2'></span>
          |
          <span className='m-2'></span>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    </div>
  )
}

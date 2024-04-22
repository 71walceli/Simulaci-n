import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import { T } from '../I18n/'


export default function Home() {
  const { locale } = useRouter()

  return (
    <div className={styles.container}>
      <Head>
        <title>Simuladores de Probabilidad</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Simuladores de Probabilidad
        </h1>
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
        <p>
          Por Walter Anthony Celi Vaca<br />
          Ingeniería en Ciencias de la Computación<br />
          Universidad Agraria del Ecuador<br />
        </p>
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
  )
}

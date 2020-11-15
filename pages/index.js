import Head from "next/head";
import styles from "../styles/Home.module.css";
import fetch from "node-fetch";

const googledoc =
  "https://docs.google.com/document/d/e/2PACX-1vTjJlu5T5kU6kNRso9fiNK-8DP7pDgzQSd75MUkHWN9348CjNhGOKEe_iD1v_w-eBci0-b8Q-J0KQzv/pub?embedded=true";

const youtubeEmbed = (youtubeId) => `
  <div className="video" style="position: relative; padding-bottom: 56.25%; padding-top: 0.25%; height: 0">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" src="https://www.youtube.com/embed/${youtubeId}" frameBorder="0" allowFullscreen></iframe>
  </div>`;

function cleanHTML(html) {
  return html
    .replace(/<style[^>]*>([^<]+)<\/style>/gi, "")
    .replace(
      /<img[^>]+src="([^"]+)" style="width: ([0-9]+)(\.[0-9]+)?px[^>]+>/gi,
      `<img src="$1" style="width: $2px; max-width: 100%;" />`
    )
    .replace(/<span style[^>]+>/gi, "<span>")
    .replace(/<a [^>]*>https?:\/\/(www\.)?(youtu.be\/|youtube.com\/(embed\/|watch\?v=))([a-z0-9_-]{11})[^<]*<\/a>/gi, (match, p1, p2, p3, p4) => youtubeEmbed(p4))
    .replace(/<hr style="page-break[^"]+">/gi, "<hr>");
}

export async function getStaticProps() {
  const res = await fetch(googledoc);
  const html = await res.text();
  console.log(html);
  return {
    props: { html: cleanHTML(html) },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home({ html }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Playstreets Brussels</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="Participate in a play street in your neighborhood or organise one!"
        />
      </Head>

      <main className={styles.main}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://citizenspring.earth"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/citizenspring.svg"
            alt="Citizen Spring Logo"
            className={styles.logo}
          />
        </a>
      </footer>
    </div>
  );
}

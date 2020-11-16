import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";

export async function getStaticProps({ params }) {
  const googleDocId = "1gEw7u-Fh3ZDhqy_qCzvyMKIHt7o9Ac584kcJQrEjceg";
  const html = await getHTMLFromGoogleDocId(googleDocId);

  return {
    props: { html, googleDocId },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home({ html, googleDocId }) {
  return (
    <div className="w-full">
      <Head>
        <title>Citizen Spring 🌻</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="Citizen initiatives to rebuild local communities"
        />
      </Head>

      <main className="max-w-screen-md px-4 mx-auto">
        {!html && <p>Loading...</p>}
        {html === "not_published" && (
          <ErrorNotPublished googleDocId={googleDocId} />
        )}
        {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
      </main>

      <Footer googleDocId={googleDocId} />
    </div>
  );
}

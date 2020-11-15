import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";

export async function getStaticPaths() {
  return {
    paths: [
      { params: { docid: "1gEw7u-Fh3ZDhqy_qCzvyMKIHt7o9Ac584kcJQrEjceg" } },
      { params: { docid: "1iT52-iZixBxFTsJjQo6SYAixaKtZIM5Gg3ZsAal6B4E" } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const html = await getHTMLFromGoogleDocId(params.docid);

  return {
    props: { html, googleDocId: params.docid },
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
        {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
        {!html && <ErrorNotPublished googleDocId={googleDocId} />}
      </main>

      <Footer />
    </div>
  );
}

import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";
import RenderGoogleDoc from "../components/RenderGoogleDoc";

const aliases = {
  about: "1iT52-iZixBxFTsJjQo6SYAixaKtZIM5Gg3ZsAal6B4E",
  faq: "1gEw7u-Fh3ZDhqy_qCzvyMKIHt7o9Ac584kcJQrEjceg",
  academy: "1Ru5vxtTuOQOsOldapez1DaLUBatQjdf2tXI_WCrRrz8",
  "academy/faq": "1fU9NWBlGym-as1UFmntSon8gLYRK-BIHVSyapIREez8",
};

export async function getStaticPaths() {
  const paths = [];
  Object.keys(aliases).forEach((key) => {
    paths.push({
      params: {
        docid: aliases[key],
      },
    });
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const googleDocId = aliases[params.docid.toLowerCase()] || params.docid;
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
        {html && <RenderGoogleDoc html={html} />}
      </main>

      <Footer googleDocId={googleDocId} />
    </div>
  );
}

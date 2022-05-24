import React from "react";
import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";
import RenderGoogleDoc from "../components/RenderGoogleDoc";
import sitemap from "../sitemap.json";

export async function getStaticProps({ params }) {
  const googleDocId = sitemap.index.googleDocId;
  const page = await getHTMLFromGoogleDocId(googleDocId);

  return {
    props: { page, googleDocId },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default class Home extends React.Component {
  render() {
    const { page, googleDocId } = this.props;
    return (
      <div className="w-full">
        <Head>
          <title>{sitemap.index.title}</title>
          <link rel="icon" href={sitemap.index.favicon} />
          <meta name="description" content={sitemap.index.description} />
          <meta name="og:image" content={sitemap.index.image} />
        </Head>

        <main className="content max-w-screen-md px-4 mx-auto">
          {!page.body && <p>Loading...</p>}
          {page.body === "not_published" && (
            <ErrorNotPublished googleDocId={googleDocId} />
          )}
          {page.body && <RenderGoogleDoc html={page.body} />}
        </main>

        <Footer googleDocId={googleDocId} />
      </div>
    );
  }
}

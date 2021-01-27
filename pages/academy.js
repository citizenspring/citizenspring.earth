import React from "react";
import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";
import RenderGoogleDoc from "../components/RenderGoogleDoc";

export async function getStaticProps({ params }) {
  const googleDocId = "1Ru5vxtTuOQOsOldapez1DaLUBatQjdf2tXI_WCrRrz8";
  const html = await getHTMLFromGoogleDocId(googleDocId);

  return {
    props: { html, googleDocId },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default class Home extends React.Component {
  render() {
    const { html, googleDocId } = this.props;
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
}

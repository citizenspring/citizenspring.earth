import Head from "next/head";
import { getHTMLFromGoogleDocId } from "../lib/googledoc";
import Footer from "../components/Footer";
import ErrorNotPublished from "../components/ErrorNotPublished";
import RenderGoogleDoc from "../components/RenderGoogleDoc";

const defaultValues = {
  title: "Citizen Spring 🌻",
  description: "Citizen initiatives to rebuild local communities",
  image:
    "https://citizenspring.earth/citizenspring-logo-flower-transparent-medium.png",
};

const pages = {
  about: { googleDocId: "1iT52-iZixBxFTsJjQo6SYAixaKtZIM5Gg3ZsAal6B4E" },
  faq: { googleDocId: "1gEw7u-Fh3ZDhqy_qCzvyMKIHt7o9Ac584kcJQrEjceg" },
  academy: {
    title: "Citizen Spring Academy 🌱🌻",
    description:
      "Get €5.000 and a fellow citizen entrepreneur as a mentor to help you start a sustainable place in Brussels",
    googleDocId: "1Ru5vxtTuOQOsOldapez1DaLUBatQjdf2tXI_WCrRrz8",
    image: "https://citizenspring.earth/citizenspring-academy.png",
  },
  "academy/faq": {
    title: "Citizen Spring Academy 🌱🌻 FAQ",
    description:
      "Get €5.000 and a fellow citizen entrepreneur as a mentor to help you start a sustainable place in Brussels",
    googleDocId: "1fU9NWBlGym-as1UFmntSon8gLYRK-BIHVSyapIREez8",
  },
  "academy/about": {
    title: "Citizen Spring Academy 🌱🌻 About",
    description:
      "Get €5.000 and a fellow citizen entrepreneur as a mentor to help you start a sustainable place in Brussels",
    googleDocId: "1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs",
  },
};

export async function getStaticPaths() {
  const paths = [];
  Object.keys(pages).forEach((key) => {
    paths.push({
      params: {
        googleDocId: pages[key].googleDocId,
      },
    });
  });

  return {
    paths,
    fallback: true,
  };
}

function getPageInfo(param) {
  let pageInfo = pages[param.toLowerCase()];
  if (pageInfo) return pageInfo;
  // search by param
  Object.keys(pages).forEach((key) => {
    if (pages[key].googleDocId === param) {
      pageInfo = pages[key];
    }
  });
  return pageInfo || {};
}

export async function getStaticProps({ params }) {
  const pageInfo = getPageInfo(params.googleDocId);
  pageInfo.googleDocId = pageInfo.googleDocId || params.googleDocId;
  const html = await getHTMLFromGoogleDocId(pageInfo.googleDocId);
  return {
    props: { html, pageInfo },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home({ html, pageInfo }) {
  if (!pageInfo) return <div />;
  return (
    <div className="w-full">
      <Head>
        <title>{pageInfo.title || defaultValues.title}</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content={pageInfo.description || defaultValues.description}
        />
        <meta name="og:image" content={pageInfo.image || defaultValues.image} />
      </Head>

      <main className="max-w-screen-md px-4 mx-auto">
        {!html && <p>Loading...</p>}
        {html === "not_published" && (
          <ErrorNotPublished googleDocId={pageInfo.googleDocId} />
        )}
        {html && <RenderGoogleDoc html={html} />}
      </main>

      <Footer googleDocId={pageInfo.googleDocId} />
    </div>
  );
}

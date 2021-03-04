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
  citizenbikegarden: {
    description:
      "A citizen initiative to build a bike shed with a community garden and a blackboard to communicate with neighbors",
    googleDocId: "1U_Yxqb2UyE0_47d6SeD_k79fkLZmOtLn8XTPAuuNBsA",
  },
  citizengarden: {
    title: "Citizen Garden",
    description:
      "A tiny community garden trying to find its place in a city made for cars",
    googleDocId: "1_GPtdLQ2hx-fGCjvRC9dlSZ2Qdd8od5ap5IsJ909EuE",
  },
  academy: {
    title: "Citizen Spring Academy 🌱🌻",
    description:
      "Get €5.000 to start a new sustainable place in Brussels with the help of a fellow citizen entrepreneur.",
    googleDocId: "1Ru5vxtTuOQOsOldapez1DaLUBatQjdf2tXI_WCrRrz8",
    image: "https://citizenspring.earth/citizenspring-academy-fb.png",
  },
  "academy/faq": {
    title: "Citizen Spring Academy 🌱🌻 FAQ",
    description:
      "Get €5.000 to start a new sustainable place in Brussels with the help of a fellow citizen entrepreneur.",
    googleDocId: "1fU9NWBlGym-as1UFmntSon8gLYRK-BIHVSyapIREez8",
    image: "https://citizenspring.earth/citizenspring-academy-fb.png",
  },
  "academy/about": {
    title: "Citizen Spring Academy 🌱🌻 About",
    description:
      "Get €5.000 to start a new sustainable place in Brussels with the help of a fellow citizen entrepreneur.",
    googleDocId: "1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs",
    image: "https://citizenspring.earth/citizenspring-academy-fb.png",
  },
  house: { googleDocId: "16SdrHEPc6UvyNbROeksQrFjeMSIJs_aK-mN40cjsPe8" },
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
  if (!pageInfo) {
    // search by param
    Object.keys(pages).forEach((key) => {
      if (pages[key].googleDocId === param) {
        pageInfo = pages[key];
      }
    });
  }
  return pageInfo || {};
}

export async function getStaticProps({ params }) {
  const pageInfo = getPageInfo(params.googleDocId);
  const googleDocId = pageInfo.googleDocId || params.googleDocId;
  const doc = await getHTMLFromGoogleDocId(googleDocId);

  const page = {
    title: pageInfo.title || doc.title || null,
    description: pageInfo.description || doc.description || null,
    image: pageInfo.image || null,
    body: doc.body,
    googleDocId,
  };

  return {
    props: { page },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every 180 seconds
    revalidate: 180,
  };
}

export default function Home({ page }) {
  if (!page) return <div />;
  const { title, description, body, image, googleDocId } = page;
  return (
    <div className="w-full">
      <Head>
        <title>{title || defaultValues.title}</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content={description || defaultValues.description}
        />
        <meta name="og:image" content={image || defaultValues.image} />
      </Head>

      <main className="max-w-screen-md px-4 mx-auto">
        {!body && <p>Loading...</p>}
        {body === "not_published" && (
          <ErrorNotPublished googleDocId={googleDocId} />
        )}
        {body && <RenderGoogleDoc html={body} />}
      </main>

      <Footer googleDocId={googleDocId} />
    </div>
  );
}

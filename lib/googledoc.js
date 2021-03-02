import fetch from "node-fetch";
import cheerio from "cheerio";
import { renderToString } from "react-dom/server";
import XMLToReact from "@condenast/xml-to-react";
import YouTubeEmbed from "../components/YouTubeEmbed";

function cleanHTML(html) {
  return html
    .replace(
      /<a [^>]*>https?:\/\/(www\.)?(youtu.be\/|youtube.com\/(embed\/|watch\?v=))([a-z0-9_-]{11})[^<]*<\/a>/gi,
      (match, p1, p2, p3, p4) => `<YouTube id="${p4}" />`
    )
    .replace(/<img ([^>]+)>/gi, "<img $1 />")
    .replace(/ (alt|title)=""/gi, "")
    .replace(/<hr style="page-break[^"]+">/gi, '<div class="pagebreak" />');
}

function convertDomToReactTree(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });

  function Image({ children, i, src, style }) {
    const size = style.match(/width: ([0-9]+).*height: ([0-9]+)/i);
    const parentStyle = $(`img[src="${src}"]`).parent().first().attr("style");
    const transform = parentStyle.match(/ transform: ([^;]+);/i);
    const margin = parentStyle.match(/ margin: ([^;]+);/i);
    const containerStyle = {
      display: "block",
      transform: transform[1],
      margin: margin[1],
    };
    if (size[1] > 500) {
      containerStyle.textAlign = "center";
    }
    const img = (
      <span style={containerStyle}>
        <img src={src} width={size[1]} height={size[2]} />
      </span>
    );
    return img;
  }

  function Br({ children }) {
    return (
      <span>
        <br />
        {children}
      </span>
    );
  }

  const xmlToReact = new XMLToReact({
    html: () => ({ type: "html" }),
    body: () => ({ type: "body" }),
    // style: (attrs) => ({ type: "style", props: attrs }),
    div: (attrs) => ({ type: "div", props: { className: attrs.class } }),
    span: (attrs) => ({ type: "span", props: { className: attrs.class } }),
    a: (attrs) => ({
      type: "a",
      props: { className: attrs.class, href: attrs.href },
    }),
    p: (attrs) => ({ type: "p", props: { className: attrs.class } }),
    br: (attrs) => ({ type: Br, props: { className: attrs.class } }),
    h1: (attrs) => ({ type: "h1", props: { className: attrs.class } }),
    h2: (attrs) => ({ type: "h2", props: { className: attrs.class } }),
    h3: (attrs) => ({ type: "h3", props: { className: attrs.class } }),
    h4: (attrs) => ({ type: "h4", props: { className: attrs.class } }),
    ul: (attrs) => ({ type: "ul", props: { className: attrs.class } }),
    ol: (attrs) => ({ type: "ol", props: { className: attrs.class } }),
    li: (attrs) => ({ type: "li", props: { className: attrs.class } }),
    table: (attrs) => ({ type: "table", props: { className: attrs.class } }),
    tbody: (attrs) => ({ type: "tbody", props: { className: attrs.class } }),
    tr: (attrs) => ({ type: "tr", props: { className: attrs.class } }),
    td: (attrs) => ({ type: "td", props: { className: attrs.class } }),
    YouTube: (attrs) => ({ type: YouTubeEmbed, props: { id: attrs.id } }),
    img: (attrs) => ({ type: Image, props: attrs }),
  });
  return xmlToReact.convert(xml);
}

const processHTML = (htmlText) => {
  if (htmlText.indexOf("#email-display") !== -1) {
    return "not_published";
  }

  const $ = cheerio.load(cleanHTML(htmlText), { xmlMode: true });
  const styles = $("#contents style").html();
  const newStyles = styles.replace(
    /([^{]+){([^}]+)}/gi,
    (matches, selector, style) => {
      if (selector.match(/\.c[0-9]+/)) {
        // return matches;
        return matches
          .replace(/font-family:[^;}]+;?/gi, "")
          .replace(/line-height:[^;}]+;?/gi, "")
          .replace(
            /(margin|padding)(-(top|right|bottom|left))?:[^};]+\;?/gi,
            ""
          );
      } else return "";
    }
  );

  let title, description;
  $("h1,h2,p").each((i, e) => {
    if (["h1", "h2"].includes(e.name)) {
      const text = $(e).text();
      if (text && !title) {
        title = text;
      }
    } else if (title && !description) {
      description = $(e).text();
    }
  });

  $("a").each((i, e) => {
    const href = $(e).attr("href");
    // Turn links to other Google Docs documents
    // e.g. https://docs.google.com/document/d/1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs/edit#heading=h.xgnlbr1pklz4
    // into internal links /1Nl9JsoDPHHGtoQAHWaY-7GAsrTur8XixemGZsIKb9Vs
    if (href) {
      let newValue = decodeURIComponent(
        href
          .replace("https://www.google.com/url?q=", "")
          .replace(/&sa=D(&source=.+)?&ust=[0-9]+&usg=.{28}/, "")
      );
      const matches = href.match(
        /https:\/\/docs.google.com\/document\/d\/(.{44})/i
      );
      if (
        href.indexOf("docs.google.com/document/d/") !== -1 &&
        href.indexOf("/copy") === -1
      ) {
        newValue = `/${matches[1]}`;
      }
      $(e).attr("href", newValue);
    }
  });
  $("#contents > div").removeClass(); // remove the first container that has a max-width
  const xml = $("<div/>").append($("#contents > div")).html();

  const tree = convertDomToReactTree(xml);
  const body = `<style>${newStyles}</style>${renderToString(tree)}`;
  return { title, description, body };
};

export async function getHTMLFromGoogleDocId(docid) {
  const googledoc = `https://docs.google.com/document/d/${docid}`;
  const res = await fetch(`${googledoc}/pub`);
  console.log(">>> loading google doc", googledoc);

  const htmlText = await res.text();
  const doc = processHTML(htmlText);
  return doc;
}

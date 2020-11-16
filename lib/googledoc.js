import fetch from "node-fetch";
import cheerio from "cheerio";

const youtubeEmbed = (youtubeId) => `
  <div class="video full-width" style="position: relative; padding-bottom: 56.25%; padding-top: 0.25%; height: 0">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" src="https://www.youtube.com/embed/${youtubeId}" frameBorder="0" allowFullscreen></iframe>
  </div>`;

function cleanHTML(html) {
  return html
    .replace(
      /<img[^>]+src="([^"]+)" style="width: ([0-9]+)(\.[0-9]+)?px[^>]+>/gi,
      `<img src="$1" style="width: $2px; max-width: 100%;" />`
    )
    .replace(
      /<a [^>]*>https?:\/\/(www\.)?(youtu.be\/|youtube.com\/(embed\/|watch\?v=))([a-z0-9_-]{11})[^<]*<\/a>/gi,
      (match, p1, p2, p3, p4) => youtubeEmbed(p4)
    )
    .replace(/<hr style="page-break[^"]+">/gi, "<hr>");
}

const processHTML = (htmlText) => {
  if (htmlText.indexOf("#email-display") !== -1) {
    return "not_published";
  }

  const $ = cheerio.load(cleanHTML(htmlText));
  $("head").remove();
  $("#header").remove();
  $("#footer").remove();
  $("script").remove();
  const styles = $("style").html();
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
  $("style").html(newStyles);
  $("a").each((i, e) => {
    const href = $(e).attr("href");
    let newValue = $(e)
      .attr("href")
      .replace("https://www.google.com/url?q=", "")
      .replace(/&sa=D&ust=[0-9]+&usg=.{28}/, ""); //.replace(/&amp;.+$/, '');

    if (href) {
      const matches = href.match(
        /https:\/\/docs.google.com\/document\/d\/(.{44})/i
      );
      if (href.indexOf("docs.google.com/document/d/") !== -1) {
        newValue = `/${matches[1]}`;
      }
      $(e).attr("href", newValue);
    }
  });
  return $.html();
};

export async function getHTMLFromGoogleDocId(docid) {
  const googledoc = `https://docs.google.com/document/d/${docid}`;
  const res = await fetch(`${googledoc}/pub`);
  console.log(">>> loading google doc", googledoc);

  const htmlText = await res.text();
  const html = processHTML(htmlText);
  return html;
}

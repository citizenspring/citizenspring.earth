import sitemap from "../sitemap.json";

/**
 * Get the page metadata (title, description, googleDocId, image, ...)
 * @param {*} param can be either a slug or the googleDocId
 * @returns
 */
export function getPageMetadata(param) {
  let pageInfo = sitemap[param ? param.toLowerCase() : "index"];
  if (!pageInfo) {
    // search by param
    Object.keys(sitemap).forEach((key) => {
      if (
        sitemap[key].googleDocId === param ||
        (sitemap[key].aliases &&
          sitemap[key].aliases.indexOf(param.toLowerCase()) !== -1)
      ) {
        pageInfo = sitemap[key];
        pageInfo.slug = key;
      }
    });
  }
  return pageInfo || {};
}

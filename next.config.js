module.exports = {
  env: {
    OC_GRAPHQL_API: "https://api.opencollective.com/graphql/v1/",
    OC_GRAPHQL_API_V2: "https://api.opencollective.com/graphql/v2/",
  },
  swcMinify: false,
  images: {
    domains: [
      "lh1.googleusercontent.com",
      "lh2.googleusercontent.com",
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "dl.airtable.com",
      "pbs.twimg.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "drive.citizenspring.earth",
          },
        ],
        permanent: false,
        destination:
          "https://drive.google.com/drive/u/0/folders/1ooAOhv3OGXAforyuYUA9i2B0kb1uP471",
      }
    ];
  },
};

import rss from "@astrojs/rss";
import { SITE as site } from "../data/env";

export const get = async () => {
  const files = import.meta.glob("./notes/*.md*");
  const blogPosts = Object.values(files).map(async (post) => {
    const file = await post() as any;
    const { title, summary, pubDate, draft } = file.frontmatter;
    return { title, description: summary, link: file.url, pubDate, draft };
  });

  const items = await Promise.all(blogPosts).then((items) =>
    items.filter((post) => !post.draft)
  );

  return rss({
    title: "EmNudge's Notes",

    description: "Mostly Programming",
    customData: `<language>en-us</language>`,
    site,

    items,
  });
};

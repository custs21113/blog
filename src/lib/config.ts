export const config = {
  site: {
    title: "磐一的博客",
    name: "磐一",
    description: "Thoughts on Full-stack development, AI",
    keywords: ["磐一的博客", "AI", "Full Stack Developer"],
    url: "https://nougat.icu",
    baseUrl: "https://nougat.icu",
    image: "https://nougat.icu/og-image.png",
    favicon: {
      ico: "/favicon.ico",
      png: "/favicon.png",
      svg: "/favicon.svg",
      appleTouchIcon: "/favicon.png",
    },
    manifest: "/site.webmanifest",
    rss: {
      title: "磐一的博客",
      description: "Thoughts on Full-stack development, AI",
      feedLinks: {
        rss2: "/rss.xml",
        json: "/feed.json",
        atom: "/atom.xml",
      },
    },
  },
  author: {
    name: "custs21113",
    email: "rock_one_tech@163.com",
    bio: "磐一，一名全栈开发工程师，喜欢 AI 相关的技术。",
  },
  social: {
    github: "https://github.com/custs21113",
    // x: "https://x.com/xxx",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/5fd8b955000000000100197f",
    // wechat: "https://storage.xxx.com/images/wechat-official-account.png",
    buyMeACoffee: "https://www.buymeacoffee.com/panyi",
  },
  giscus: {
    repo: "custs21113/blog",
    repoId: "R_kgDORg03Yw",
    categoryId: "DIC_kwDORg03Y84C34px",
  },
  navigation: {
    main: [
      { 
        title: "文章", 
        href: "/blog",
      },
      { 
        title: "读书笔记", 
        href: "/note",
      },
    ],
  },
  seo: {
    metadataBase: new URL("https://nougat.icu"),
    alternates: {
      canonical: './',
    },
    openGraph: {
      type: "website" as const,
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image" as const,
      creator: "@xxx",
    },
  },
};

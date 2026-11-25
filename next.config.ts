import type { NextConfig } from 'next';

/**
 * User agents that get metadata in <head> before the body streams, instead of
 * appended at the end of <body>. Next 16 streams it to every agent not on its
 * list, and the list (copied below, from next/dist/shared/lib/router/utils/
 * html-bots) has neither Googlebot nor any AI crawler: on the dynamic product
 * pages, OAI-SearchBot, ClaudeBot and PerplexityBot got the title, canonical
 * and hreflang only after the page body, which crawlers that do not run
 * JavaScript may never use. Setting this option replaces the default list, so
 * the defaults are repeated first.
 */
const NEXT_DEFAULT_HTML_LIMITED_BOTS =
  '[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight';
const SEARCH_AND_AI_BOTS =
  'Googlebot|OAI-SearchBot|ChatGPT-User|GPTBot|ClaudeBot|Claude-SearchBot|Claude-User|PerplexityBot|Perplexity-User|Amazonbot|meta-externalagent|CCBot';

const nextConfig: NextConfig = {
  htmlLimitedBots: new RegExp(`${NEXT_DEFAULT_HTML_LIMITED_BOTS}|${SEARCH_AND_AI_BOTS}`, 'i'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.migflowers.com',
        pathname: '/storage/**',
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

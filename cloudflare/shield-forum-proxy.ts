const shieldForumProxy = {
  async fetch(request: Request): Promise<Response> {
    const incomingUrl = new URL(request.url);
    const targetUrl = new URL(
      `${incomingUrl.pathname}${incomingUrl.search}`,
      "https://shield-forum.vercel.app",
    );

    const headers = new Headers(request.headers);
    headers.set("host", "shield-forum.vercel.app");
    headers.set("x-forwarded-host", incomingUrl.host);
    headers.set("x-shield-forum-edge", "cloudflare-workers");

    return fetch(
      new Request(targetUrl, {
        method: request.method,
        headers,
        body: request.body,
        redirect: "manual",
      }),
    );
  },
};

export default shieldForumProxy;

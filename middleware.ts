export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/builder/:path*", "/api/activities/:path*"],
};

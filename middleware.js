import { auth } from "./lib/auth";

export default auth((req) => {
  if (!req.auth && protectedRoutes.includes(req.nextUrl.pathname)) {
    const url = req.url.replace(req.nextUrl.pathname, "/api/auth/signin");
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export const protectedRoutes = ["/universe", "/points"];

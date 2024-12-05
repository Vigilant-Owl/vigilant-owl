import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // console.log(user);

  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/new-group") ||
      request.nextUrl.pathname.startsWith("/reports") ||
      request.nextUrl.pathname.startsWith("/profile") ||
      request.nextUrl.pathname.startsWith("/subscriptions") ||
      request.nextUrl.pathname.startsWith("/update-password"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  // if (
  //   !user &&
  //   !request.nextUrl.pathname.slice(3).startsWith("/login") &&
  //   !request.nextUrl.pathname.slice(3).startsWith("/register") &&
  //   !request.nextUrl.pathname.slice(3).startsWith("/check") &&
  //   request.nextUrl.pathname !== "/"
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.rewrite(url);
  // }

  // if (user) {
  //   const { data } = await supabase
  //     .from("profiles")
  //     .select("userType")
  //     .eq("id", user?.id)
  //     .single();
  //   if (
  //     !data?.userType ||
  //     (data.userType === User_Type.RESIDENT &&
  //       request.nextUrl.pathname.slice(3).startsWith("/admin"))
  //   ) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = "/login";
  //     return NextResponse.rewrite(url);
  //   }
  // }

  return supabaseResponse;
}

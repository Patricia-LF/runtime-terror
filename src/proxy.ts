import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, ACCESS_COOKIE_VALUE } from "./lib/accessCookie";
import { TIVOLI_MODE } from "./lib/gameConfig";

// export function proxy(request: NextRequest) {
//     console.log("PROXY RUNNING");

//     const accessGranted =
//         request.cookies.get(ACCESS_COOKIE_NAME)?.value ===
//         ACCESS_COOKIE_VALUE;

//     if (TIVOLI_MODE && !accessGranted) {
//         const redirectUrl = new URL("/", request.url);
//         return NextResponse.redirect(redirectUrl);
//     }

//     return NextResponse.next();
// }

export function proxy(request: NextRequest) {
    const accessGranted =
        request.cookies.get(ACCESS_COOKIE_NAME)?.value === ACCESS_COOKIE_VALUE;

    if (TIVOLI_MODE && !accessGranted) {
        // DO NOT redirect here
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/haunted-house/:path*"],
};
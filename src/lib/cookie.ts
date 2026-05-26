import { cookies } from "next/headers";
import {
    ACCESS_COOKIE_MAX_AGE_SECONDS,
    ACCESS_COOKIE_NAME,
    ACCESS_COOKIE_OPTIONS,
    ACCESS_COOKIE_PATH,
    ACCESS_COOKIE_VALUE,
} from "./accessCookie";

const ACCESS_COOKIE_SCOPED_OPTIONS = {
    ...ACCESS_COOKIE_OPTIONS,
    path: ACCESS_COOKIE_PATH,
    maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
};

export async function setAccessCookie() {
    const cookieStore = await cookies();
    cookieStore.set({
        name: ACCESS_COOKIE_NAME,
        value: ACCESS_COOKIE_VALUE,
        ...ACCESS_COOKIE_SCOPED_OPTIONS,
    });
}

export async function checkAccessCookie() {
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get(ACCESS_COOKIE_NAME);
    return accessCookie?.value === ACCESS_COOKIE_VALUE;
}

export async function clearAccessCookie() {
    const cookieStore = await cookies();

    cookieStore.delete({
        name: ACCESS_COOKIE_NAME,
        path: ACCESS_COOKIE_PATH,
    });
}
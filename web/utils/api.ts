"use server";

import { getToken } from "./auth";

export async function apiGet(route: string): Promise<Response> {
	return await apiFetch("GET", route);
}

export async function apiPost(route: string, rawBody: any): Promise<Response> {
	return await apiFetch_rawBody("POST", route, rawBody);
}

export async function apiPatch(route: string, rawBody: any): Promise<Response> {
	return await apiFetch_rawBody("PATCH", route, rawBody);
}

export async function apiDelete(route: string): Promise<Response> {
	return await apiFetch_rawBody("DELETE", route);
}

export async function apiFetch_rawBody(
	method: string,
	route: string,
	rawBody: any = undefined,
): Promise<Response> {
	return await apiFetch(method, route, JSON.stringify(rawBody));
}

export async function apiFetch(
	method: string,
	route: string,
	body: any = undefined,
) {
	return await fetch(`${process.env.API_URL}${route}`, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${await getToken()}`,
		},
		body: body,
	});
}

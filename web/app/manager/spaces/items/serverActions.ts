"use server";

import { apiPatch } from "@/utils/api";

export async function modifySpaceItem(id: number, data: any) {
	const res = await apiPatch(`/space/manager/item/${id}`, data);

	let resData: any;

	try {
		resData = await res.json();
	} catch (error) {
		return {
			status: 404,
			statusText: "Not Found",
			ok: false,
			data: { error: "Api Route Not Found" },
		};
	}

	return {
		status: res.status,
		statusText: res.statusText,
		ok: res.ok,
		data: resData,
	};
}

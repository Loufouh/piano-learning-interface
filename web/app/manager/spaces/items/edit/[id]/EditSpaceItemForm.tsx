"use client";

import Link from "next/link";
import { useState } from "react";
import type { SpaceItemType } from "@/app/types/SpaceItemType";
import { modifySpaceItem } from "../../serverActions";

export default function EditSpaceItemForm({ item }: { item: SpaceItemType }) {
	const [formData, setFormData] = useState({
		text: item.text,
		linkUrl: item.linkUrl,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const submit = async (e: React.FormEvent) => {
		e.preventDefault();

		const res = await modifySpaceItem(item.id, formData);

		if (!res.ok) {
			console.error(res.data.error);
		}
	};

	return (
		<form
			className="flex flex-col justify-start items-center gap-4 bg-white p-4"
			onSubmit={submit}
		>
			<h1 className="mt-5 mb-10 font-bold text-3xl">Modifier le SpaceItem</h1>
			<div className="flex flex-col items-center gap-5">
				<label htmlFor="name">Text</label>
				<input
					className="bg-amber-100 p-4 rounded w-100 text-center"
					type="text"
					id="text"
					name="text"
					placeholder="Texte à afficher"
					value={formData.text}
					onChange={handleChange}
				/>
				<label htmlFor="linkUrl">LinkUrl</label>
				<div className="gap-2 grid grid-cols-5 w-100">
					<input
						className="col-span-4 bg-amber-100 p-4 rounded text-center"
						type="url"
						id="linkUrl"
						name="linkUrl"
						placeholder="[une url]"
						value={formData.linkUrl}
						onChange={handleChange}
					/>
					<Link
						className="bg-blue-400 p-4 rounded font-bold text-white text-center"
						href={formData.linkUrl}
					>
						Tester
					</Link>
				</div>
				<button
					className="bg-green-500 p-4 rounded w-30 font-bold text-white text-center cursor-pointer"
					type="submit"
				>
					Valider
				</button>
			</div>
		</form>
	);
}

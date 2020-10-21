import { unlinkSync } from "fs";
import * as FormModel from "../models/form.model";
import { capture } from "../utils/screenshot";
import { saveImage, deleteImage } from "../utils/imgur";

function captureScreenshotAndUpload(id, deleteHash) {
	capture(id)
		.then(async (path) => {
			try {
				const res = await saveImage(path);
				console.log(res);
				unlinkSync(path); // Remove file
				if (deleteHash) {
					await deleteImage(deleteHash);
				}
			} catch (e) {
				console.error(e);
			}
		})
		.catch((e) => console.error(e));
}

export async function fetch(req, res) {
	try {
		const { id } = req.params;
		const { uid } = req.client;
		const form = await FormModel.fetch(id, uid);
		return res.success("Details fetched", form);
	} catch (e) {
		return res.error(e);
	}
}

export async function create(req, res) {
	try {
		const { title, description } = req.body;
		const creator = req.client;
		const form = await FormModel.create({ title, description, creator });
		captureScreenshotAndUpload(form.id);
		return res.success("Form created", form);
	} catch (e) {
		return res.error(e);
	}
}

export async function edit(req, res) {
	try {
		const { id } = req.params;
		const { uid } = req.client;
		const { title, description, questionnaires, section } = req.body;
		const form = await FormModel.edit(id, uid, {
			title,
			description,
			questionnaires,
			section,
		});
		captureScreenshotAndUpload(form.id);
		return res.success("Form saved", form);
	} catch (e) {
		return res.error(e);
	}
}

export async function remove(req, res) {
	try {
		const { id } = req.params;
		const { uid } = req.client;
		await FormModel.remove(id, uid);
		return res.success("Form deleted");
	} catch (e) {
		return res.error(e);
	}
}

export async function list(req, res) {
	try {
		const { uid } = req.client;
		const { page, limit } = req.query;
		const forms = await FormModel.list(uid, {
			page: page ? Number(page) : 1,
			limit: limit ? Number(limit) : 20,
		});
		return res.success("List fetched", forms);
	} catch (e) {
		return res.error(e);
	}
}

export default {
	fetch,
	create,
	remove,
	list,
	edit,
};

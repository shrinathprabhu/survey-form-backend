import { Types } from "mongoose";
import { FormMock } from "../../__mocks__/models.mock";
import * as FormModel from "../../src/models/form.model";

test("Create a form document", async (done) => {
	const createdForm = {
		_id: Types.ObjectId(),
		title: "Untitled Form",
		description: "Some description",
		questionnaires: [],
		creator: {
			uid: "somerandomuid",
			ip: "127.0.0.1",
			browser: "bot",
			os: "mock-os",
			userAgent: "bot (mock-os)",
		},
	};
	FormMock.toReturn([], "find");
	FormMock.toReturn(0, "countDocuments");
	const list = await FormModel.list("somerandom", {});
	expect(list).toHaveProperty("page", 1);
	expect(list).toHaveProperty("size", 0);
	expect(list).toHaveProperty("totalRecords", 0);
	expect(list).toHaveProperty("pages", 0);
	expect(list).toHaveProperty("list", []);
	done();
});

test("Returns blank list with pagination properties", async (done) => {
	FormMock.toReturn([], "find");
	FormMock.toReturn(0, "countDocuments");
	const list = await FormModel.list("somerandom", {});
	expect(list).toHaveProperty("page", 1);
	expect(list).toHaveProperty("size", 0);
	expect(list).toHaveProperty("totalRecords", 0);
	expect(list).toHaveProperty("pages", 0);
	expect(list).toHaveProperty("list", []);
	done();
});

import { FormMock, formsData } from "../../__mocks__/models.mock";
import * as FormModel from "../../src/models/form.model";

describe("Form creation works as expected", () => {
    test("Creates a form document", async (done) => {
        let createdForm = formsData[0];
        FormMock.toReturn(createdForm, "save");
        const form = await FormModel.create({
            title: createdForm.title,
            description: createdForm.description,
            creator: createdForm.creator,
        });
        expect(form).toHaveProperty("id", createdForm._id);
        expect(form).toHaveProperty("title", createdForm.title);
        expect(form).toHaveProperty("description", createdForm.description);
        expect(form).toHaveProperty("status", createdForm.status);
        expect(form).toHaveProperty("createdAt", createdForm.createdAt);
        done();
    });
});

describe("Form listing works as expected", () => {
    test("Returns form list with pagination properties", async (done) => {
        FormMock.toReturn(formsData, "find");
        FormMock.toReturn(formsData.length, "countDocuments");
        let mockResponse = formsData.map((form) => {
            return {
                id: form._id,
                title: form.title,
                description: form.description,
            };
        });
        const list = await FormModel.list("somerandom", {});
        expect(list).toHaveProperty("page", 1);
        expect(list).toHaveProperty("size", 2);
        expect(list).toHaveProperty("totalRecords", 2);
        expect(list).toHaveProperty("pages", 1);
        expect(list).toHaveProperty("list", mockResponse);
        done();
    });

    test("Returns blank list with pagination properties", async (done) => {
        FormMock.toReturn([], "find");
        FormMock.toReturn(0, "countDocuments");
        let mockResponse = [].map((form) => {
            return {
                id: form._id,
                title: form.title,
                description: form.description,
            };
        });
        const list = await FormModel.list("somerandom", {});
        expect(list).toHaveProperty("page", 1);
        expect(list).toHaveProperty("size", 0);
        expect(list).toHaveProperty("totalRecords", 0);
        expect(list).toHaveProperty("pages", 0);
        expect(list).toHaveProperty("list", mockResponse);
        done();
    });
});

describe("Access control for forms works as expected", () => {
    test("can access if id and uid returns a form", async (done) => {
        let accessibleForm = formsData[0];
        FormMock.toReturn(accessibleForm, "findOne");
        let canAccess = await FormModel.canAccess(
            accessibleForm._id,
            accessibleForm.creator.uid
        );
        expect(canAccess).toBeTruthy();
        done();
    });

    test("cannot access if id and uid doesn't returns a form", async (done) => {
        let accessibleForm = formsData[0];
        FormMock.toReturn(undefined, "findOne");
        let canAccess = await FormModel.canAccess(
            accessibleForm._id,
            accessibleForm.creator.uid
        );
        expect(canAccess).toBeFalsy();
        done();
    });
});

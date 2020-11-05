import mockingoose from "mockingoose";
import { Types } from "mongoose";
import { Form } from "../src/models/form.model";

export let FormMock = mockingoose(Form);

export let formsData = [
    {
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
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: Types.ObjectId(),
        title: "Untitled Form",
        description: "Some description",
        questionnaires: [],
        creator: {
            uid: "somerandomuid2",
            ip: "192.168.0.1",
            browser: "bot",
            os: "mock-os",
            userAgent: "bot (mock-os)",
        },
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
    },
]
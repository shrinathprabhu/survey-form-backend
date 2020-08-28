import { Schema, Types } from 'mongoose';
import db from '../config/database';
import constants from '../config/constants';
import { canAccess } from '../models/form.model';

let ResponseSchema = new Schema({
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'forms'
    },
    client: {
        uid: String,
        ip: String,
        browser: String,
        os: String,
        userAgent: String
    },
    responses: [
        {
            questionId: Schema.Types.ObjectId,
            question: String,
            response: String
        }
    ]
}, {
    timestamps: true,
    strict: 'throw',
    useNestedStrict: true
});

let Response = db.model('response', ResponseSchema);

export async function submit(formId, client, responses) {
    let isSubmitted = await isResponseSubmitted(formId, client.uid);
    if (isSubmitted) {
        throw "Response already submitted";
    } else {
        return await new Response({
            formId,
            client,
            responses
        }).save();
    }
}

export async function list(formId, uid, { page = 1, limit = 50 }) {
    if (typeof formId === 'string') {
        formId = Types.ObjectId(formId);
    }
    if (await canAccess(formId, uid)) {
        let skipValue = constants.calculateSkipValue(page, limit);
        let responses = await Response.find({ formId }, "responses client").skip(skipValue).limit(limit).lean().exec();
        let totalRecords = await Response.countDocuments({ formId }).exec();
        let list = responses.map(response => {
            return {
                responses: response.responses,
                browser: response.client.browser,
                os: response.client.os,
                ip: response.client.ip
            }
        });
        return constants.paginate(page, limit, totalRecords, list);
    } else throw "Form not found";
}

export async function isResponseSubmitted(formId, uid) {
    if (typeof formId) {
        formId = Types.ObjectId(formId);
    }
    let response = await Response.findOne({ formId, "client.uid": uid }).exec();
    if (response && response.id) return true;
    return false;
}

export default {
    submit,
    list,
    isSubmitted: isResponseSubmitted
}
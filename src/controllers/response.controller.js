import ResponseModel from '../models/response.model';

export async function submit(req, res, next) {
    try {
        let formId = req.form.id;
        let client = req.client;
        let responses = req.body.responses;
        await ResponseModel.submit(formId, client, responses);
        return res.success("Response recorded");
    } catch (e) {
        return res.error(e);
    }
}

export async function list(req, res, next) {
    try {
        let uid = req.client.uid;
        let formId = req.form.id;
        let { page, limit } = req.query;
        let responses = await ResponseModel.list(formId, uid, { page: page ? Number(page) : 1, limit: limit ? Number(limit) : 50 });
        return res.success("List fetched", responses);
    } catch (e) {
        return res.error(e);
    }
}

export async function isResponseRecorded(req, res, next) {
    try {
        let uid = req.client.uid;
        let formId = req.form.id;
        let isRecorded = await ResponseModel.isSubmitted(formId, uid);
        return res.success("", { isRecorded });
    } catch (e) {
        return res.error(e);
    }
}

export default {
    list,
    submit,
    isRecorded: isResponseRecorded
};
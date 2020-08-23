import FormModel from '../models/form.model';

export async function fetch(req, res, next) {
    try {
        let id = req.params.id;
        let uid = res.locals.client.uid;
        let form = await FormModel.fetch(id, uid);
        return res.success("Details fetched", form)
    } catch (e) {
        return res.error(e);
    }
}

export async function create(req, res, next) {
    try {
        let { title, description } = req.body;
        let creator = res.locals.client;
        let form = await FormModel.create({ title, description, creator });
        return res.success("Form created", form);
    } catch (e) {
        return res.error(e);
    }
}

export async function edit(req, res, next) {
    try {

    } catch (e) {
        return res.error(e);
    }
}

export async function remove(req, res, next) {
    try {
        let id = req.params.id;
        let uid = res.locals.client.uid;
        await FormModel.remove(id, uid);
        return res.success("Form deleted");
    } catch (e) {
        return res.error(e);
    }
}

export async function list(req, res, next) {
    try {
        let uid = res.locals.client.uid;
        let { page, limit } = req.query;
        let forms = await FormModel.list(uid, { page: page ? Number(page) : 1, limit: limit ? Number(limit) : 20 });
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
    edit
};
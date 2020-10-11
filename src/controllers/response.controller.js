import * as ResponseModel from '../models/response.model';

export async function submit(req, res) {
  try {
    const formId = req.form.id;
    const { client } = req;
    const { responses } = req.body;
    await ResponseModel.submit(formId, client, responses);
    return res.success('Response recorded');
  } catch (e) {
    return res.error(e);
  }
}

export async function list(req, res) {
  try {
    const { uid } = req.client;
    const formId = req.form.id;
    const { page, limit } = req.query;
    const responses = await ResponseModel.list(
      formId,
      uid,
      {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 50,
      },
    );
    return res.success('List fetched', responses);
  } catch (e) {
    return res.error(e);
  }
}

export async function isResponseRecorded(req, res) {
  try {
    const { uid } = req.client;
    const formId = req.form.id;
    const isRecorded = await ResponseModel.isResponseSubmitted(formId, uid);
    return res.success('', { isRecorded });
  } catch (e) {
    return res.error(e);
  }
}

export default {
  list,
  submit,
  isResponseRecorded,
};

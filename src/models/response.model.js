/* eslint-disable no-underscore-dangle */
import { Schema, Types } from 'mongoose';
import db from '../config/database';
import constants from '../config/constants';
import { canAccess } from './form.model';

const ResponseSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'forms',
  },
  client: {
    uid: String,
    ip: String,
    browser: String,
    os: String,
    userAgent: String,
  },
  responses: [
    {
      _id: false,
      questionId: Schema.Types.ObjectId,
      question: String,
      response: String,
    },
  ],
}, {
  timestamps: true,
  strict: 'throw',
  useNestedStrict: true,
});

const Response = db.model('response', ResponseSchema);

export async function isResponseSubmitted(formID, uid) {
  let formId;
  if (typeof formID) {
    formId = Types.ObjectId(formId);
  } else {
    formId = formID;
  }
  const response = await Response.findOne({ formId, 'client.uid': uid }).exec();
  if (response && response.id) return true;
  return false;
}

export async function submit(formId, client, responses) {
  const isSubmitted = await isResponseSubmitted(formId, client.uid);
  if (isSubmitted) {
    throw new Error('Response already submitted');
  } else {
    const recordedResponse = await new Response({
      formId,
      client,
      responses,
    }).save();
    return recordedResponse;
  }
}

export async function list(formID, uid, { page = 1, limit = 50 }) {
  let formId;
  if (typeof formID === 'string') {
    formId = Types.ObjectId(formId);
  } else {
    formId = formID;
  }
  const can = await canAccess(formId, uid);
  // console.log(can);
  if (can) {
    const skipValue = constants.calculateSkipValue(page, limit);
    const responses = await Response.find({ formId }, 'responses client')
      .skip(skipValue)
      .limit(limit)
      .lean()
      .exec();
    const totalRecords = await Response.countDocuments({ formId }).exec();
    const dataList = responses.map((response) => ({
      responses: response.responses,
      browser: response.client.browser,
      os: response.client.os,
      ip: response.client.ip,
    }));
    return constants.paginate(page, limit, totalRecords, dataList);
  } throw new Error('Form not found');
}

const ResponseModel = {
  submit,
  list,
  isResponseSubmitted,
};

export default ResponseModel;

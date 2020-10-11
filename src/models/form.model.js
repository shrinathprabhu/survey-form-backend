import { Schema } from 'mongoose';
import db from '../config/database';
import constants from '../config/constants';
import QuestionnaireSchema from './questionnaire.schema';

const FormSchema = new Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled form',
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questionnaires: [QuestionnaireSchema],
  section: {
    isExists: Boolean,
    type: { type: String, enum: ['list', 'stepper'] },
  },
  creator: {
    uid: String,
    ip: String,
    browser: String,
    os: String,
    userAgent: String,
  },
  status: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ['active', 'deleted', 'inactive'],
  },
  deletedAt: Date,
  closedAt: Date,
  isPublished: {
    type: Boolean,
    default: false,
  },
  colorScheme: {
    theme: String,
    background: String,
  },
  screenshot: {
    id: String,
    deleteHash: String,
    link: String,
  },
}, {
  timestamps: true,
  strict: 'throw',
  useNestedStrict: true,
});

const Form = db.model('forms', FormSchema);

export async function create({ title, description, creator }) {
  // console.log(title, description, creator);
  const form = (await Form.create({
    title, description, creator, status: 'active',
  })).toJSON();
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    status: form.status,
    createdAt: form.createdAt,
  };
}

export async function fetch(id, uid) {
  let form = await Form.findOne({ _id: id, 'creator.uid': uid, status: { $in: ['active', 'inactive'] } }).lean().exec();
  if (form) {
    return {
      id: form.id,
      title: form.title,
      description: form.description,
      questionnaires: form.questionnaires,
      isCreator: true,
    };
  }
  form = await Form.findOne({ _id: id, status: 'active' }, 'title description questionnaires').lean().exec();
  if (form) {
    return {
      id: form.id,
      title: form.title,
      description: form.description,
      questionnaires: form.questionnaires,
    };
  } throw new Error('Form not found');
}

export async function list(uid, { page = 1, limit = 20 }) {
  const skipValue = constants.calculateSkipValue(page, limit);
  const forms = await Form.find({ 'creator.uid': uid, status: { $in: ['active', 'inactive'] } }, 'title description').sort({ createdAt: -1 }).skip(skipValue).limit(limit)
    .lean()
    .exec();
  const totalRecords = await Form.countDocuments({ 'creator.uid': uid, status: 'active' }).exec();
  const dataList = forms.map((form) => ({
    id: form.id,
    title: form.title,
    description: form.description,
  }));
  return constants.paginate(page, limit, totalRecords, dataList);
}

export async function edit(id, uid, {
  title, description, questionnaires, section,
}) {
  const data = {};
  if (typeof title === 'string' && title.trim()) {
    data.title = title;
  }
  if (typeof description === 'string' && description.trim()) {
    data.description = description;
  }
  if (section) {
    data.section = section;
  }
  if (questionnaires instanceof Array) {
    data.questionnaires = questionnaires;
  }
  let form = await Form.findOneAndUpdate(
    { _id: id, 'creator.uid': uid, status: { $in: ['active', 'inactive'] } },
    data,
    { new: true },
  ).exec();
  if (form) {
    form = form.toJSON();
    return {
      id: form.id,
      title: form.title,
      description: form.description,
      status: form.status,
      questionnaires: form.questionnaires,
      section: form.section,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    };
  } throw new Error('Form not found');
}

export async function remove(id, uid) {
  const form = await Form.findOneAndUpdate({ _id: id, 'creator.uid': uid, status: { $in: ['active', 'inactive'] } }, { status: 'deleted', deletedAt: new Date() }).lean().exec();
  if (form) {
    return console.log('Form deleted by admin', form.id);
  }
  throw new Error('Form not found');
}

export async function canAccess(id, uid) {
  const form = await Form.findOne({ _id: id, 'creator.uid': uid }).exec();
  if (form && form.id) return true;
  return false;
}

export async function publish(id, uid) {
  const form = await Form.findOneAndUpdate({ _id: id, 'creator.uid': uid, status: 'active' }, { isPublished: true }).lean().exec();
  if (form) {
    return {
      id: form.id,
      shareableLink: 'comingsoon',
    };
  }
  throw new Error('Form not found');
}

export default {
  create,
  fetch,
  list,
  edit,
  remove,
  publish,
};

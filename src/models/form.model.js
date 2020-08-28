import { Schema, Types } from 'mongoose';
import db from '../config/database';
import constants from '../config/constants';
import QuestionnaireSchema from './questionnaire.schema';

let FormSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: 'Untitled form',
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    questionnaires: [QuestionnaireSchema],
    creator: {
        uid: String,
        ip: String,
        browser: String,
        os: String,
        userAgent: String
    },
    status: {
        type: String,
        trim: true,
        lowercase: true,
        enum: ['active', 'deleted']
    },
    deletedAt: Date
}, {
    timestamps: true,
    strict: 'throw',
    useNestedStrict: true
});

let Form = db.model('forms', FormSchema);

export async function create({ title, description, creator }) {
    console.log(title, description, creator);
    let form = (await Form.create({ title, description, creator, status: 'active' })).toJSON();
    return {
        id: form._id,
        title: form.title,
        description: form.description
    }
}

export async function fetch(id, uid) {
    let form = await Form.findOne({ _id: id, "creator.uid": uid, status: 'active' }).lean().exec();
    if (form) {
        return {
            id: form._id,
            title: form.title,
            description: form.description,
            questionnaires: form.questionnaires,
            isCreator: true
        }
    } else {
        form = (await Form.findOne({ _id: id, status: 'active' }, "title description questionnaires").exec()).toJSON();
        if (form) {
            return {
                id: form._id,
                title: form.title,
                description: form.description,
                questionnaires: form.questionnaires
            }
        } else return "Form not found";
    }
}

export async function list(uid, { page = 1, limit = 20 }) {
    let skipValue = constants.calculateSkipValue(page, limit);
    let forms = await Form.find({ "creator.uid": uid, status: 'active' }, "title description").skip(skipValue).limit(limit).lean().exec();
    let totalRecords = await Form.countDocuments({ "creator.uid": uid, status: 'active' }).exec();
    let list = forms.map(form => {
        return {
            id: form._id,
            title: form.title,
            description: form.description
        }
    });
    return constants.paginate(page, limit, totalRecords, list);
}

export async function edit(id, uid, data) {
    let updateableData = {};

    let form = await Form.findOneAndUpdate({ _id: id, "creator.uid": uid, status: 'active' }, updateableData).exec();

}

export async function remove(id, uid) {
    let form = await Form.findOneAndUpdate({ _id: id, "creator.uid": uid, status: 'active' }, { status: 'deleted', deletedAt: new Date() }).lean().exec();
    if (form) {
        return console.log("Form deleted by admin", form.id);
    } else {
        throw "Form not found";
    }
}

export async function canAccess(id, uid) {
    if (typeof id === 'string') {
        id = Types.ObjectId(id);
    }
    let form = await Form.findOne({ _id: id, "client.uid": uid }).exec();
    if (form && form.id) return true;
    return false;
}

export default {
    create,
    fetch,
    list,
    edit,
    remove
}
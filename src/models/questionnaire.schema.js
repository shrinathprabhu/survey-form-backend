import { Schema } from 'mongoose';

let Questionnaire = new Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled Question'
    },
    description: {
        type: String,
        trim: true
    },
    answerType: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ['text', 'paragraph', 'radiobutton', 'checkbox', 'dropdown', 'range'],
        default: 'text'
    },
    media: [
        {
            _id: false,
            type: { type: String },
            url: String,
        }
    ],
    options: [
        {
            _id: false,
            rank: Number,
            name: {
                type: String,
                trim: true
            }
        }
    ],
    isRequired: {
        type: Boolean,
        required: true,
        default: false
    },
    section: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

export default Questionnaire;
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
        enum: ['Short answer', 'Paragraph', 'Multiple choice', 'Checkbox', 'Dropdown', 'Range', 'Date', 'Time'],
        default: 'Short answer'
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
            },
            other: {
                type: Boolean
            }
        }
    ],
    isRequired: {
        type: Boolean,
        required: true,
        default: false
    },
    section: {
        type: Number,
        name: String
    }
}, {
    versionKey: false,
    timestamps: true
});

export default Questionnaire;
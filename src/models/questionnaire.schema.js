import { Schema } from 'mongoose';

let Questionnaire = new Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled Question'
    },
    index: Number,
    description: {
        type: String,
        trim: true
    },
    answerType: {
        type: String,
        required: true,
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
    range: {
        lowerLimit: Number,
        upperLimit: Number,
        numberOfSteps: Number,
        single: Boolean
    },
    isRequired: {
        type: Boolean,
        required: true,
        default: false
    },
    validation: {
        needed: Boolean,
        rule: {
            type: { type: String },
            value: String
        }
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
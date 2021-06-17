const db = require('mongoose');

const schema = new db.Schema({
    name: { type: String, minlength: 3, maxlength: 100, required: true, trim: true },
    type: { type: String, minlength: 3, maxlength: 100, required: true, trim: true },
    image: { type: String },
    uniqName: { type: String, maxlength: 20, trim: true },
    url: { type: String, maxlength: 20, trim: true },
    faildReason: { type: String, maxlength: 20, trim: true },
    status: { type: String, enum: ['PENDING', 'FAILD', 'DEPLOYED'], default: 'PENDING' },
}, { timestamps: true });

const Project = db.model('project', schema);

module.exports = Project;

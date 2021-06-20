const db = require('mongoose');

const schema = new db.Schema({
    name: { type: String, required: true, trim: true },
    repository: { type: String, required: true, trim: true },
    projectType: { type: String, required: true, trim: true },
    dbType: { type: String, trim: true },
    image: { type: String, default: 'https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-7.jpg' },
    url: { type: String, trim: true, default: '#' },
    faildReason: { type: String, trim: true },
    status: { type: String, enum: ['PENDING', 'FAILD', 'DEPLOYED'], default: 'PENDING' },
}, { timestamps: true });

const Project = db.model('project', schema);

module.exports = Project;

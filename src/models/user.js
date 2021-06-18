const db = require('mongoose');

const schema = new db.Schema({
    firstName: { type: String, minlength: 3, maxlength: 100, required: true, trim: true },
    lastName: { type: String, minlength: 3, maxlength: 100, required: true, trim: true },
    fullName: { type: String },
    cne: { type: String, maxlength: 20, trim: true },
    password: { type: String, minlength: 6, trim: true },
    email: { type: String, trim: true },
    projects:[db.Schema.Types.ObjectId],
    isActive:{ type: Boolean, default: true },
}, { timestamps: true });
schema.pre('init', (doc) => {
    doc.fullName = `${doc.lastName} ${doc.firstName}`;
});

const User = db.model('user', schema);

module.exports = User;

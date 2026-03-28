const moonoose = require('mongoose');

const todoSchema = new moonoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const taskSchema = new moonoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: Date, required: true },
    assignedTo: { type: moonoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: moonoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attachments: [{ type: String }],
    todoCheckList : [todoSchema],
    progress: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = moonoose.model('Task', taskSchema);
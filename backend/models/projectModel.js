const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    budget: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    category: {
      type: String,
      required: true,
      enum: ['logo', 'branding', 'ui-ux', 'illustration', 'other'],
    },
    requirements: [{
      type: String,
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
    }],
    messages: [{
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
      },
    }],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 
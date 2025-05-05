const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder', 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

// Make folder name unique per user **within the same parent**
folderSchema.index({ name: 1, userId: 1, parentId: 1 }, { unique: true });

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;

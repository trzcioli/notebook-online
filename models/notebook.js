var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotebookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    updatedAt: {type: Date, default: Date.now},
  }
);

// Virtual for book's URL
NotebookSchema
.virtual('url')
.get(function () {
  return '/notebook/' + this._id;
});

//Export model
module.exports = mongoose.model('Notebook', NotebookSchema);
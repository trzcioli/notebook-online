var mongoose = require('mongoose');

var bcrypt = require('bcrypt')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    login: {type: String, required: true, max: 25},
    password: {type: String, required: true, min: 6},
  }
);

// Virtual for author's full name
UserSchema
.virtual('name')
.get(function () {
  return this.login;
});


// Virtual for author's URL
UserSchema
.virtual('url')
.get(function () {
  return '/catalog/user/' + this._id;
});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
  if (err) {
      return next(err);
  }
  user.password = hash;
  next();
  })
});

//Export model
module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const _ = require('underscore');

let UnitModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  strength: {
    type: Number,
    min: 0,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

UnitSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

UnitSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return UnitModel.find(search).select('name age strength').exec(callback);
};

UnitModel = mongoose.model('Unit', UnitSchema);

module.exports = {
  UnitModel,
  UnitSchema,
};

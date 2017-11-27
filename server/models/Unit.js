const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const _ = require('underscore');

let UnitModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const UnitSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

UnitSchema.statics.toAPI = (doc) => ({

});

UnitSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return UnitModel.find(search).select('type').exec(callback);
};

UnitModel = mongoose.model('Unit', UnitSchema);

module.exports = {
  UnitModel,
  UnitSchema,
};

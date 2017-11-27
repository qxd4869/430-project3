const models = require('../models');

const Unit = models.Unit;

const makerPage = (req, res) => {
  Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), units: docs });
  });
};

const makeUnit = (req, res) => {
//  if (!req.body.name) {
//    return res.status(400).json({ error: 'RAWR! Both name and age are required!' });
//  }

  const unitData = {
    type: req.body.type,
    owner: req.session.account._id,
  };

  const newUnit = new Unit.UnitModel(unitData);

  const unitPromise = newUnit.save();

  unitPromise.then(() => res.json({ redirect: '/maker' }));

  unitPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'RAWR! Unit already exists!' });
    }

    return res.status(400).json({ error: 'RAWR! An error occurred!' });
  });

  return unitPromise;
};

const getUnits = (request, response) => {
  const req = request;
  const res = response;

  return Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }

    return res.json({ units: docs });
  });
};

const deleteUnit = (req, res) => {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({ error: 'RAWR! That domo cannot be deleted' });
  }
  const unitPromise = Unit.UnitModel.remove({ _id: id });

  unitPromise.then(() => res.json({ redirect: '/maker' }));

  unitPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'RAWR! Domo already exists!' });
    }

    return res.status(400).json({ error: 'RAWR! An error occurred!' });
  });

  return unitPromise;
};

module.exports = {
  makerPage,
  make: makeUnit,
  getUnits,
  deleteUnit,
};

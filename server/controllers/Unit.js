const models = require('../models');

const Unit = models.Unit;
const Account = models.Account;

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
  
  let id = req.session.account._id;
  
  const unitData = {
    type: req.body.type,
    owner: req.session.account._id,
  };

  const newUnit = new Unit.UnitModel(unitData);
  let unitPromise = 5;
      

    Account.AccountModel.findById(id, (err, userAccount) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      }
      
      if(userAccount.unitCount > 50){
        return res.status(400).json({ error: 'Additional Supply Depots required' });
      }
      unitPromise = newUnit.save();
      unitPromise.then(() => {
        userAccount.unitCount++;
        userAccount.save();
      });
      
      unitPromise.catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          return res.status(400).json({ error: 'RAWR! Unit already exists!' });
        }

        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      });
      
      res.json({ redirect: '/maker' });
    });

  return unitPromise;
};

const getUnits = (request, response) => {
  const req = request;
  const res = response;
  let resources = 0;
  return Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }
    
    Account.AccountModel.findById(req.session.account._id, (err, userAccount) => {
        userAccount.resources++;
        userAccount.save();
        resources = userAccount.resources;
        //console.dir(resources);
        return res.json({ units: docs, resources:resources});
    });
    

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

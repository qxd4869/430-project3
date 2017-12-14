const models = require('../models');

const Unit = models.Unit;
const Account = models.Account;

const makerPage = (req, res) => {
  Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      // console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), units: docs });
  });
};

const makeUnit = (req, res) => {
  const id = req.session.account._id;

  const unitData = {
    type: req.body.type,
    owner: req.session.account._id,
  };

  const newUnit = new Unit.UnitModel(unitData);
  let unitPromise = 5;

  // Resources check part
  const minerals = parseInt(req.body.resources.popupMinerals, 10);
  const gas = parseInt(req.body.resources.popupGas, 10);
  const supply = parseInt(req.body.resources.popupSupply, 10);

  if (supply === '10') {
    Account.AccountModel.findById(id, (err, userAccount) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      }

        //    console.log(typeof(b));
      if (minerals >= userAccount.minerals) {
        return res.status(400).json({ error: 'Not enough minerals' });
      }

      const changeAccount = userAccount;
      changeAccount.maxUnit += 10;
      changeAccount.minerals -= 100;
      changeAccount.save();
      return res.json({ redirect: '/maker' });
    });
  } else {
    Account.AccountModel.findById(id, (err, userAccount) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      }

      //    console.log(typeof(b));
      if (minerals >= userAccount.minerals) {
        return res.status(400).json({ error: 'Not enough minerals' });
      }
      if (gas >= userAccount.gas) {
        return res.status(400).json({ error: 'Insufficient Vespene Gas' });
      }
      // if (userAccount.unitCount + supply > userAccount.maxUnit) {
      if (userAccount.unitCount + supply > userAccount.maxUnit) {
        return res.status(400).json({ error: 'Additional Supply Depots required' });
      }

      unitPromise = newUnit.save();
      unitPromise.then(() => {
        const changeAccount = userAccount;
        changeAccount.minerals -= minerals;
        changeAccount.gas -= gas;
        changeAccount.unitCount += supply;
        // changeAccount.resources -= 20;
        changeAccount.save();
      });

      unitPromise.catch((err2) => {
        console.log(err2);
        if (err2.code === 11000) {
          return res.status(400).json({ error: 'RAWR! Unit already exists!' });
        }

        return res.status(400).json({ error: 'RAWR! An error occurred!' });
      });

      return res.json({ redirect: '/maker' });
    });
  }

  return unitPromise;
};

const getUnits = (request, response) => {
  const req = request;
  const res = response;
  const resources = 0;
  return Unit.UnitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! An error occurred!' });
    }

    Account.AccountModel.findById(req.session.account._id, (err2, userAccount) => {
      const changeAccount = userAccount;
      changeAccount.save();
      return res.json({ units: docs });
    });
    return resources;
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

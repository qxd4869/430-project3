const models = require('../models');

const Account = models.Account;

// GET responses for accounts
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const profilePage = (req, res) => {
  res.render('profile', { csrfToken: req.csrfToken() });
};

const changePass = (request, response) => {

//  Account.AccountModel.findById(req.session.account._id, (err, userAccount) => {
//    const changeAccount = userAccount;
//    changeAccount.password = `${req.body.pass}`;
//    req.session.account.password = changeAccount.password;
//    changeAccount.save();
//    const minerals = userAccount.minerals;
//     return res.json({ redirect: '/profile' });
//  });
  
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  let password= `${req.body.pass}`;


  return Account.AccountModel.findById(req.session.account._id, (err, userAccount) => {
    if (err || !userAccount) {
      return res.status(401).json({ error: 'Commander, you got a wrong password' });
    }

    const newAccount = userAccount;

    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      newAccount.password = hash;
      newAccount.salt = salt;

      const savePromise = newAccount.save();

      savePromise.then(() => res.json({
        password: newAccount.password,
      }));

      savePromise.catch((saveErr) => {
        res.json(saveErr);
      });

      return res.json({ redirect: '/profile' });
    });
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// POST responses for accounts
const login = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // validate data
  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // validate data
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'RAWR! Username already exists!' });
      }

      return res.status(400).json({ error: 'An error occurred!' });
    });
  });
};

const updateResources = (request, response) => {
  const req = request;
  const res = response;

  Account.AccountModel.findById(req.session.account._id, (err, userAccount) => {
    const changeAccount = userAccount;
    changeAccount.minerals++;
    changeAccount.gas++;
    changeAccount.save();
    const minerals = userAccount.minerals;
    const gas = userAccount.gas;
    const unitCount = userAccount.unitCount;
    const maxUnit = userAccount.maxUnit;
    return res.json({ minerals, gas, unitCount, maxUnit });
  });
};


const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports = {
  loginPage,
  profilePage,
  changePass,
  logout,
  login,
  signup,
  updateResources,
  getToken,
};

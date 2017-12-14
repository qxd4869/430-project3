'use strict';

var handleUnit = function handleUnit(e, csrf, clicked_name) {
  e.preventDefault();

  $('#unitMessage').animate({ width: 'hide' }, 350);

  var popupMinerals = parseInt(document.getElementById("popupMinerals").innerHTML);
  var popupGas = parseInt(document.getElementById("popupGas").innerHTML);
  var popupSupply = parseInt(document.getElementById("popupSupply").innerHTML);

  var data = {};
  if (clicked_name === 'depot') {
    data = {
      type: clicked_name,
      _csrf: csrf,
      resources: {
        popupMinerals: 100,
        popupGas: 0,
        popupSupply: 10
      }
    };
  } else {
    data = {
      type: clicked_name,
      _csrf: csrf,
      resources: {
        popupMinerals: popupMinerals,
        popupGas: popupGas,
        popupSupply: popupSupply
      }
    };

    //Data to send
    var audioFile = "#" + clicked_name + "_ready";
    //Play units ready sound
    $(audioFile)[0].play();
  }

  //Data to send
  var sendData = $.param(data);

  //before you play sound
  //check if a song is   being played

  sendAjax('POST', $('#unitForm').attr('action'), sendData, function () {
    loadUnitsFromServer(csrf);
  });

  return false;
};

var UnitForm = function UnitForm(props) {
  return React.createElement(
    'form',
    { id: 'unitForm',
      onSubmit: function onSubmit(e) {
        handleUnit(e, props.csrf);
      },
      name: 'unitForm',
      action: '/maker',
      method: 'POST',
      className: 'unitForm' },
    React.createElement('img', { id: 'vulture', src: '/assets/img/vulture.png', onClick: function onClick(e) {
        handleUnit(e, props.csrf, "vulture");
      }, alt: 'vulture', className: 'produceIcon' }),
    React.createElement('img', { id: 'siegetank', src: '/assets/img/siegetank.png', onClick: function onClick(e) {
        handleUnit(e, props.csrf, "siegetank");
      }, alt: 'siege tank', className: 'produceIcon' }),
    React.createElement('img', { id: 'goliah', src: '/assets/img/goliah.png', onClick: function onClick(e) {
        handleUnit(e, props.csrf, "goliah");
      }, alt: 'goliah', className: 'produceIcon' }),
    React.createElement(
      'span',
      { className: 'info' },
      React.createElement('img', { className: 'popupResourceIcon', src: '/assets/img/mineral.png' }),
      React.createElement(
        'span',
        { id: 'popupMinerals', className: 'popupResource' },
        '150'
      ),
      React.createElement('img', { className: 'popupResourceIcon', src: '/assets/img/gas.png' }),
      React.createElement(
        'span',
        { id: 'popupGas', className: 'popupResource' },
        '100'
      ),
      React.createElement('img', { className: 'popupResourceIcon', src: '/assets/img/supply.png' }),
      React.createElement(
        'span',
        { id: 'popupSupply', className: 'popupResource' },
        '2'
      )
    ),
    React.createElement(
      'span',
      { className: 'resources' },
      props.unitCount,
      '/',
      props.maxUnit,
      ' '
    ),
    React.createElement('img', { className: 'resourcesIcon', src: '/assets/img/supply.png' }),
    React.createElement(
      'span',
      { id: 'gas', className: 'resources' },
      props.gas
    ),
    React.createElement('img', { className: 'resourcesIcon', src: '/assets/img/gas.png' }),
    React.createElement(
      'span',
      { id: 'minerals', className: 'resources' },
      props.minerals
    ),
    React.createElement('img', { className: 'resourcesIcon', src: '/assets/img/mineral.png' }),
    React.createElement('img', { id: 'cyclone', src: '/assets/img/cyclone.png', onClick: function onClick(e) {
        handleUnit(e, props.csrf, "cyclone");
      }, alt: 'cyclone', className: 'produceIcon produceIcon2' }),
    React.createElement('img', { id: 'depot', src: '/assets/img/depot.png', onClick: function onClick(e) {
        handleUnit(e, props.csrf, "depot");
      }, alt: 'depot', className: 'produceIcon depot' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
  );
};

var UnitList = function UnitList(props) {
  if (props.units.length === 0) {
    return React.createElement(
      'div',
      { className: 'unitList' },
      React.createElement(
        'h3',
        { className: 'emptyUnit' },
        'No Units yet.'
      )
    );
  }
  var vultures = 0;
  var siegetanks = 0;
  var goliahs = 0;
  var cyclones = 0;

  var unitNodes = props.units.map(function (unit) {
    if (unit.type == 'vulture') {
      vultures++;
    }

    if (unit.type == 'siegetank') {
      siegetanks++;
    }

    if (unit.type == 'goliah') {
      goliahs++;
    }

    if (unit.type == 'cyclone') {
      cyclones++;
    }
  });

  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'unitList' },
      React.createElement(
        'span',
        { key: unit._id, className: 'unit' },
        React.createElement('img', { src: "/assets/img/vulture.png", alt: 'domo face', className: 'unitFace' })
      ),
      React.createElement(
        'span',
        null,
        vultures
      )
    ),
    React.createElement(
      'div',
      { className: 'unitList' },
      React.createElement(
        'span',
        { key: unit._id, className: 'unit' },
        React.createElement('img', { src: "/assets/img/siegetank.png", alt: 'domo face', className: 'unitFace' })
      ),
      React.createElement(
        'span',
        null,
        siegetanks
      )
    ),
    React.createElement(
      'div',
      { className: 'unitList' },
      React.createElement(
        'span',
        { key: unit._id, className: 'unit' },
        React.createElement('img', { src: "/assets/img/goliah.png", alt: 'domo face', className: 'unitFace' })
      ),
      React.createElement(
        'span',
        null,
        goliahs
      )
    ),
    React.createElement(
      'div',
      { className: 'unitList' },
      React.createElement(
        'span',
        { key: unit._id, className: 'unit' },
        React.createElement('img', { src: "/assets/img/cyclone.png", alt: 'domo face', className: 'unitFace' })
      ),
      React.createElement(
        'span',
        null,
        cyclones
      )
    )
  );
};

var loadUnitsFromServer = function loadUnitsFromServer(csrf) {
  sendAjax('GET', '/getUnits', null, function (data) {
    ReactDOM.render(React.createElement(UnitList, { units: data.units, csrf: csrf }), document.querySelector('#units'));
  });
};

var updateResources = function updateResources(csrf) {
  sendAjax('GET', '/updateResources', null, function (data) {
    ReactDOM.render(React.createElement(UnitForm, { csrf: csrf, minerals: data.minerals, gas: data.gas, unitCount: data.unitCount, maxUnit: data.maxUnit }), document.querySelector('#makeUnit'));
  });
  //console.dir(Math.floor(Math.random() * 501) + 200);
};

var updateTimer = function updateTimer() {
  return Math.floor(Math.random() * 501) + 200;
};

var setup = function setup(csrf) {

  //set interval for the user for resources
  ReactDOM.render(React.createElement(UnitForm, { csrf: csrf }), document.querySelector('#makeUnit'));

  ReactDOM.render(React.createElement(UnitList, { units: [], csrf: csrf }), document.querySelector('#units'));

  loadUnitsFromServer(csrf);

  setTooltip();

  setInterval(function () {
    updateResources(csrf);
  }, 200);
};

var getToken = function getToken() {
  sendAjax('GET', 'getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var setTooltip = function setTooltip() {
  var info = document.querySelector(".info");
  var produceIcon = document.getElementsByClassName("produceIcon");
  for (var i = 0; i < produceIcon.length; i++) {
    produceIcon[i].addEventListener('mouseover', function () {
      info.classList.toggle("show");
    });

    produceIcon[i].addEventListener("mouseout", function () {
      info.classList.toggle("show");
    });
  }

  document.getElementById("vulture").addEventListener("mouseover", function () {
    document.getElementById("popupMinerals").innerHTML = 75;
    document.getElementById("popupGas").innerHTML = 0;
    document.getElementById('popupSupply').innerHTML = 2;
  });

  document.getElementById("siegetank").addEventListener("mouseover", function () {
    document.getElementById("popupMinerals").innerHTML = 150;
    document.getElementById("popupGas").innerHTML = 100;
    document.getElementById("popupSupply").innerHTML = 2;
  });

  document.getElementById("goliah").addEventListener("mouseover", function () {
    document.getElementById("popupMinerals").innerHTML = 100;
    document.getElementById("popupGas").innerHTML = 50;
    document.getElementById("popupSupply").innerHTML = 2;
  });

  document.getElementById("cyclone").addEventListener("mouseover", function () {
    document.getElementById("popupMinerals").innerHTML = 25;
    document.getElementById("popupGas").innerHTML = 125;
    document.getElementById("popupSupply").innerHTML = 2;
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#unitMessage').animate({ width: 'toggle' }, 700);
};

var redirect = function redirect(response) {
  $('#unitMessage').animate({ width: 'hide' }, 700);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

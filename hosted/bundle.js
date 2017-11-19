'use strict';

var handleUnit = function handleUnit(e, csrf) {
  e.preventDefault();

  $('#unitMessage').animate({ width: 'hide' }, 350);

  if ($('#unitName').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }

  //console.dir($('#unitForm').serialize());
  //console.dir($('#unitType').val());
  sendAjax('POST', $('#unitForm').attr('action'), $('#unitForm').serialize(), function () {
    loadUnitsFromServer(csrf);
  });

  return false;
};

var deleteUnit = function deleteUnit(e, id, csrf) {
  e.preventDefault();

  $('unitMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', '/deleteUnit', 'id=' + id + '&_csrf=' + csrf, function () {
    loadUnitsFromServer(csrf);
  });
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
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'unitName', type: 'text', name: 'name', placeholder: 'Unit Name' }),
    React.createElement(
      'select',
      { id: 'unitType', name: 'type' },
      React.createElement(
        'option',
        { value: 'Vulture' },
        'Vulture'
      ),
      React.createElement(
        'option',
        { value: 'Siege Tank' },
        'Siege Tank'
      ),
      React.createElement(
        'option',
        { value: 'Goliah' },
        'Goliah'
      )
    ),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'makeUnitSubmit', type: 'submit', value: 'Make Unit' })
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

  var unitNodes = props.units.map(function (unit) {
    return React.createElement(
      'div',
      { key: unit._id, className: 'unit' },
      React.createElement('img', { src: '/assets/img/vulture.png', alt: 'domo face', className: 'unitFace' }),
      React.createElement(
        'h3',
        { className: 'unitName' },
        ' ',
        unit.name,
        ' '
      ),
      React.createElement(
        'h3',
        { className: 'unitType' },
        ' ',
        unit.type,
        ' '
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          { className: 'unitDelete', onClick: function onClick(e) {
              deleteUnit(e, unit._id, props.csrf);
            } },
          'DISBAND'
        )
      )
    );
  });

  return React.createElement(
    'div',
    { className: 'unitList' },
    unitNodes
  );
};

var loadUnitsFromServer = function loadUnitsFromServer(csrf) {
  sendAjax('GET', '/getUnits', null, function (data) {
    ReactDOM.render(React.createElement(UnitList, { units: data.units, csrf: csrf }), document.querySelector('#units'));
  });
};

var setup = function setup(csrf) {

  ReactDOM.render(React.createElement(UnitForm, { csrf: csrf }), document.querySelector('#makeUnit'));

  ReactDOM.render(React.createElement(UnitList, { units: [], csrf: csrf }), document.querySelector('#units'));

  loadUnitsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', 'getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#unitMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#unitMessage').animate({ width: 'hide' }, 350);
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
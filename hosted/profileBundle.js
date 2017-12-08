'use strict';

var handleChangePass = function handleChangePass(e) {
  e.preventDefault();

  $('#unitMessage').animate({ width: 'hide' }, 350);

  if ($('#pass').val() === '' || $('#pass2').val() === '') {
    handleError('RAWR! Passwords do not match!');
    return false;
  }

  console.dir($('#pass').val());
  sendAjax('POST', $('#changePassForm').attr('action'), $('#changePassForm').serialize(), redirect);

  return false;
};

var ChangePassWindow = function ChangePassWindow(props) {
  return React.createElement(
    'form',
    { id: 'changePassForm',
      name: 'changePassForm',
      onSubmit: handleChangePass,
      action: '/changePass',
      method: 'POST',
      className: 'mainForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement(
      'label',
      { htmlFor: 'pass2' },
      'Password: '
    ),
    React.createElement('input', { id: 'pass2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Change password' })
  );
};

var setup = function setup(csrf) {

  ReactDOM.render(React.createElement(ChangePassWindow, { csrf: csrf }), document.querySelector('#content'));
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

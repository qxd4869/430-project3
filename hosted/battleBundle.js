"use strict";
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

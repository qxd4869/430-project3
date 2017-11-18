const handleError = (message) => {
  $('#errorMessage').text(message);
  $('#unitMessage').animate({ width: 'toggle', }, 350);
};

const redirect = (response) => {
  $('#unitMessage').animate({ width: 'hide', }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    success: success,
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    },
  });
};
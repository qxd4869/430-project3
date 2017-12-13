const handleChangePass = (e) => {
  e.preventDefault();
  
  $('#unitMessage').animate({ width: 'hide' }, 350);
  
  if ($('#pass').val() === '' || $('#pass2').val() === '') {
    handleError('RAWR! Passwords do not match!');
    return false;
  }
  
  if ($('#pass').val() !== $('#pass2').val()) {
    handleError('RAWR! Passwords do not match!');
    return false;
  }
  
  console.dir($('#pass').val());
  sendAjax('POST', $('#changePassForm').attr('action'), $('#changePassForm').serialize(), redirect);
  
  return false;
};

const ChangePassWindow = (props) => {
  return (
    <form id="changePassForm"
          name="changePassForm"
          onSubmit={handleChangePass}
          action="/changePass"
          method="POST"
          className="mainForm"
      >
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Change password" />
    </form>
  );
};

const setup = (csrf) => {
  
  ReactDOM.render(
    <ChangePassWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};


const getToken = () => {
  sendAjax('GET', 'getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});
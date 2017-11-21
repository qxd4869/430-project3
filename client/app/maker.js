const handleUnit = (e, csrf) => {
  e.preventDefault();
  
  $('#unitMessage').animate({ width: 'hide' }, 350);
  
  if ($('#unitName').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }

  //console.dir($('#unitForm').serialize());
  //console.dir($('#unitType').val());
  sendAjax('POST', $('#unitForm').attr('action'), $('#unitForm').serialize(), () => {
    loadUnitsFromServer(csrf);
  });
  
  return false;
};


const UnitForm = (props) => {
  return (
    <form id="unitForm"
          onSubmit={(e) => { handleUnit(e, props.csrf );}}
          name="unitForm"
          action="/maker"
          method="POST"
          className="unitForm">
      <img src="/assets/img/vulture.png" alt="domo face" className="produceIcon" />
      <label htmlFor="name">Name: </label>
      <input id="unitName" type="text" name="name" placeholder="Unit Name" />
      <input className="makeUnitSubmit" type="submit" value="Make Unit" />
      <input type="hidden" name="_csrf" value={props.csrf} />
    </form>
  );
};

const UnitList = (props) => {
  if (props.units.length === 0) {
    return (
      <div className="unitList">
        <h3 className="emptyUnit">No Units yet.</h3>
      </div>
    );
  }
  
  const unitNodes = props.units.map((unit) => {
    return (
      <span key={unit._id} className="unit">
        <img src="/assets/img/vulture.png" alt="domo face" className="unitFace" />
      </span>
    );
  });
  
  return (
    <div className="unitList">
      {unitNodes}
    </div>
  );
};

const loadUnitsFromServer = (csrf) => {
  sendAjax('GET', '/getUnits', null, (data) => {
    ReactDOM.render(
      <UnitList units={data.units} csrf={csrf} />,
      document.querySelector('#units'),
    );
  });
};

const setup = (csrf) => {
  
  ReactDOM.render(
    <UnitForm csrf={csrf} />,
    document.querySelector('#makeUnit'),
  );
  
  ReactDOM.render(
    <UnitList units={[]} csrf={csrf} />,
    document.querySelector('#units'),
  );
  
  loadUnitsFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', 'getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(() => {
  getToken();
});
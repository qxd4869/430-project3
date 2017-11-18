const handleUnit = (e, csrf) => {
  e.preventDefault();
  
  $('#unitMessage').animate({ width: 'hide' }, 350);
  
  if ($('#unitName').val() === '' || $('#unitAge').val() === '' || $('#unitStrength').val() === '') {
    handleError('RAWR! All fields are required!');
    return false;
  }
  
  sendAjax('POST', $('#unitForm').attr('action'), $('#unitForm').serialize(), () => {
    loadUnitsFromServer(csrf);
  });
  
  return false;
};

const deleteUnit = (e, id, csrf) => {
  e.preventDefault();
 
  
  $('unitMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', '/deleteUnit', `id=${id}&_csrf=${csrf}`, () =>{
    loadUnitsFromServer(csrf);
  });
};

const UnitForm = (props) => {
  return (
    <form id="unitForm"
          onSubmit={(e) => { handleUnit(e, props.csrf );}}
          name="unitForm"
          action="/maker"
          method="POST"
          className="unitForm">
      <label htmlFor="name">Name: </label>
      <input id="unitName" type="text" name="name" placeholder="Unit Name" />
      <label htmlFor="age">Age: </label>
      <input id="unitAge" type="text" name="age" placeholder="Unit Age" />
      <label htmlFor="strength">Strength: </label>
      <input id="unitStrength" type="text" name="strength" placeholder="Unit Strength" />
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="makeUnitSubmit" type="submit" value="Make Unit" />
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
      <div key={unit._id} className="unit">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="unitFace" />
        <h3 className="unitName"> Name: {unit.name} </h3>
        <h3 className="unitAge"> Age: {unit.age} </h3>
        <h3 className="unitStrength"> Strength: {unit.strength} </h3>
        <button onClick={(e) => { deleteUnit(e, unit._id, props.csrf ); }}>
              DELETE
        </button>
      </div>
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
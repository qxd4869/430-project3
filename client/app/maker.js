const handleUnit = (e, csrf, clicked_name) => {
  e.preventDefault();
  
  $('#unitMessage').animate({ width: 'hide' }, 350);
  
  const data = {
    type: clicked_name,
    _csrf: csrf,
  };
  
  //Data to send
  const sendData = $.param(data);
  let audioFile = "#" + clicked_name + "_ready";
  //Play units ready sound
  $(audioFile)[0].play();
  
  //before you play sound
  //check if a song is   being played
  
  sendAjax('POST', $('#unitForm').attr('action'), sendData, () => {
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
      <img src="/assets/img/vulture.png" onClick={(e) => { handleUnit(e, props.csrf, "vulture" );}} alt="vulture" className="produceIcon" />
      <img src="/assets/img/siegetank.png" onClick={(e) => { handleUnit(e, props.csrf, "siegetank" );}} alt="siege tank" className="produceIcon" />
      <img src="/assets/img/goliah.png" onClick={(e) => { handleUnit(e, props.csrf, "goliah" );}} alt="goliah" className="produceIcon" />
      <img src="/assets/img/cyclone.png" onClick={(e) => { handleUnit(e, props.csrf, "cyclone" );}} alt="cyclone" className="produceIcon2" />
      <span>Resources: {props.resources}</span>
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
        <img src={"/assets/img/"+ unit.type +".png"} alt="domo face" className="unitFace" />
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
    console.dir(data.resources);
    ReactDOM.render(
      <UnitForm csrf={csrf} resources={data.resources} />,
      document.querySelector('#makeUnit'),
    );
  });
};



const setup = (csrf) => {
  
  //set interval for the user for resources
    setInterval(() => {
       loadUnitsFromServer();
    }, 200);
  
  
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
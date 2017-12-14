
const handleUnit = (e, csrf, clicked_name) => {
  e.preventDefault();
  
  $('#unitMessage').animate({ width: 'hide' }, 350);
  
  const popupMinerals = parseInt(document.getElementById("popupMinerals").innerHTML);
  const popupGas = parseInt(document.getElementById("popupGas").innerHTML);
  const popupSupply = parseInt(document.getElementById("popupSupply").innerHTML);
  
  let data = {};
  if(clicked_name === 'depot'){
    data = {
      type: clicked_name,
      _csrf: csrf,
      resources:{
        popupMinerals: 100,
        popupGas : 0,
        popupSupply : 10 
      },
    };
  }
  else {
    data = {
      type: clicked_name,
      _csrf: csrf,
      resources:{
        popupMinerals: popupMinerals,
        popupGas : popupGas,
        popupSupply : popupSupply  
      },
    };

    //Data to send
    let audioFile = "#" + clicked_name + "_ready";
    //Play units ready sound
    $(audioFile)[0].play();     
  }

  //Data to send
  const sendData = $.param(data);
  
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
      <img id="vulture" src="/assets/img/vulture.png" onClick={(e) => { handleUnit(e, props.csrf, "vulture" );}} alt="vulture" className="produceIcon" />
      <img id="siegetank" src="/assets/img/siegetank.png" onClick={(e) => { handleUnit(e, props.csrf, "siegetank" );}} alt="siege tank" className="produceIcon" />
      <img id="goliah" src="/assets/img/goliah.png" onClick={(e) => { handleUnit(e, props.csrf, "goliah" );}} alt="goliah" className="produceIcon" />
      <span className="info">      
           <img className="popupResourceIcon" src="/assets/img/mineral.png"/>
           <span id="popupMinerals" className="popupResource">150</span>
           <img className="popupResourceIcon" src="/assets/img/gas.png"/>
           <span id="popupGas" className="popupResource">100</span>
           <img className="popupResourceIcon" src="/assets/img/supply.png"/>
           <span id="popupSupply" className="popupResource">2</span>
      </span>
      <span className="resources">{props.unitCount}/{props.maxUnit} </span>
      <img className="resourcesIcon" src="/assets/img/supply.png"/>
      <span id="gas" className="resources">{props.gas}</span>
      <img className="resourcesIcon" src="/assets/img/gas.png"/>
      <span id="minerals" className="resources">{props.minerals}</span>
      <img className="resourcesIcon" src="/assets/img/mineral.png"/>
      <img id="cyclone" src="/assets/img/cyclone.png" onClick={(e) => { handleUnit(e, props.csrf, "cyclone" );}} alt="cyclone" className="produceIcon produceIcon2" />
       <img id="depot" src="/assets/img/depot.png" onClick={(e) => { handleUnit(e, props.csrf, "depot");}} alt="depot" className="produceIcon depot" />
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
  let vultures = 0;
  let siegetanks = 0;
  let goliahs = 0;
  let cyclones = 0;

  const unitNodes = props.units.map((unit) => {
    if(unit.type == 'vulture'){
      vultures++;
    }
    
    if(unit.type == 'siegetank'){
      siegetanks++;
    }

    if(unit.type == 'goliah'){
      goliahs++;
    }
    
    if(unit.type == 'cyclone'){
      cyclones++;
    }
    
  });
  
  return (
    <div>
      <div className="unitList">
          <span key={unit._id} className="unit">    
            <img src={"/assets/img/vulture.png"} alt="domo face" className="unitFace" />
          </span>
          <span>{vultures}</span>
      </div>
      <div className="unitList">
          <span key={unit._id} className="unit">    
            <img src={"/assets/img/siegetank.png"} alt="domo face" className="unitFace" />
          </span>
          <span>{siegetanks}</span>
      </div>
      <div className="unitList">
          <span key={unit._id} className="unit">    
            <img src={"/assets/img/goliah.png"} alt="domo face" className="unitFace" />
          </span>
        <span>{goliahs}</span>
      </div>
      <div className="unitList">
          <span key={unit._id} className="unit">    
            <img src={"/assets/img/cyclone.png"} alt="domo face" className="unitFace" />
          </span>
          <span>{cyclones}</span>
      </div>
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

const updateResources = (csrf) => {
  sendAjax('GET', '/updateResources', null, (data) => {
    ReactDOM.render(
      <UnitForm csrf={csrf} minerals={data.minerals} gas={data.gas} unitCount={data.unitCount} maxUnit={data.maxUnit} />,
      document.querySelector('#makeUnit'),
    );
  });
  //console.dir(Math.floor(Math.random() * 501) + 200);
};

const updateTimer = () => {
  return Math.floor(Math.random() * 501) + 200;
};

const setup = (csrf) => {
  
  //set interval for the user for resources
  ReactDOM.render(
    <UnitForm csrf={csrf} />,
    document.querySelector('#makeUnit'),
  );
  
  ReactDOM.render(
    <UnitList units={[]} csrf={csrf} />,
    document.querySelector('#units'),
  );
  
  loadUnitsFromServer(csrf);
  
  setTooltip();
    
  setInterval(() => {
        updateResources(csrf);
  }, 200);
};

const getToken = () => {
  sendAjax('GET', 'getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

const setTooltip = () =>{
  let info = document.querySelector(".info");
  let produceIcon = document.getElementsByClassName("produceIcon");
  for (let i = 0; i < produceIcon.length; i++) {
      produceIcon[i].addEventListener('mouseover', function(){
          info.classList.toggle("show");                   
      });
    
      produceIcon[i].addEventListener("mouseout", function(){
          info.classList.toggle("show");                   
      });
  }
  
  document.getElementById("vulture").addEventListener("mouseover", function(){
      document.getElementById("popupMinerals").innerHTML = 75;
      document.getElementById("popupGas").innerHTML = 0;
      document.getElementById('popupSupply').innerHTML = 2;
  });
  
  document.getElementById("siegetank").addEventListener("mouseover", function(){
      document.getElementById("popupMinerals").innerHTML = 150;
      document.getElementById("popupGas").innerHTML = 100; 
      document.getElementById("popupSupply").innerHTML = 2;
  });
  
  document.getElementById("goliah").addEventListener("mouseover", function(){
      document.getElementById("popupMinerals").innerHTML = 100;
      document.getElementById("popupGas").innerHTML = 50;
      document.getElementById("popupSupply").innerHTML = 2;
  });
  
  document.getElementById("cyclone").addEventListener("mouseover", function(){
      document.getElementById("popupMinerals").innerHTML = 25;
      document.getElementById("popupGas").innerHTML = 125;
      document.getElementById("popupSupply").innerHTML = 2;
  });
}

$(document).ready(() => {
  getToken();
});
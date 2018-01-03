GLOBAL._geoHash = require('ngeohash');

var helpers = require ("./helpers.js")
var tBlockListContainer = require("./tblockTest.js");  //xmpp adapterus

var Player = require("./player.js");  //xmpp adapterus

var LocationGenerator = require("./locationGenerator.js");  //xmpp adapterus
var world = require("./world.js");  //xmpp adapterus

var _h = new helpers()
var _w = new world()
var LC = new LocationGenerator()

//prime all locations with x amount of users


//run loop with plays and new data forming

//run loop of people moving or exchanging data

randomRole = function () {

    let roles = ["jetset","looper","loner"]
    let r = _h.steepRandomFromChoices(3);
    return roles[r];
}

randomExcerciserType = function () {

    let roles = ["weekender","steadfast","random","potato"]
    let r = _h.steepRandomFromChoices(3);
    return roles[r];
}


var loners = 0;
var loopers = 0;
var jetset = 0;

for (ff = 0; ff<1000; ff++ ){
    
    let t =randomRole()
    switch(t){
        case "jetset" :
        jetset++;
        break;
        case "looper" :
        loopers++;
        break;
        default:
        loners++;
    }
    //console.log(t+ ' '+ff);
}

//console.log("jet "+jetset+' loop '+loopers+' loners '+loners);





_w.addRandomPlayers(50);

_w.reportPockets();

//return;
//console.log(playerData);

var year = 0;
var day = 0; //increase day count

//loop years
var nextIncrease = 0;
for (dayz=0; dayz < 10; dayz++ ) {

    //players can invite players, this is to simulate non organic growth
    if (nextIncrease > 0) {

        nextIncrease--;
        console.log("------- DIA "+dayz+' --------')
        let dayUpdates = _w.updatePlayerDay(dayz);
        if (dayUpdates) {
            console.log("------- dayUpdates DIA "+dayz+' --------')
            _w.updatePlayerDataExchange(dayUpdates);
        }

        //get packets by distanceTravelled
        console.log("------- distanceStats DIA "+dayz+' --------')
            _w.getPacketDistanceStatistics();
            //process.exit()
        continue;
    }

    if (nextIncrease == 0 ) {
        nextIncrease = _h.randomIntFromInterval(1,15);
        console.log("nexting "+nextIncrease)
    }

    let addThisManyPlayers = _h.randomIntFromInterval(1,15);

    _w.addRandomPlayers(addThisManyPlayers);



}
_w.stats();
//loop days
    
    
    
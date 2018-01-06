GLOBAL._geoHash = require('ngeohash');

var helpers = require ("./helpers.js")
var tBlockListContainer = require("./tblockTest.js");  //xmpp adapterus

var Player = require("./player.js");  //xmpp adapterus

var LocationGenerator = require("./locationGenerator.js");  //xmpp adapterus
var world = require("./world.js");  //xmpp adapterus

var _h = new helpers()
var _w = new world()
var LC = new LocationGenerator()
let _und = require("underscore")

//prime all locations with x amount of users


//run loop with plays and new data forming

//run loop of people moving or exchanging data

randomRole = function () {

    let roles = ["jetset","looper","loner"]
    let r = _h.steepRandomFromChoices(3);
    return roles[r];
}

randomExcerciserType = function () {

    let roles = ["weekender","steadfast","random","potato","gumby","unicorn"]
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

/*_w.stats()
console.log("-------SIMULATION END ("+runForDays+") days ");
process.exit();*/

//_w.reportPockets();

//return;
//console.log(playerData);

var year = 0;
var day = 0; //increase day count

//loop years
var nextIncrease = 0;
var runForDays = 50;
for (dayz=0; dayz < runForDays; dayz++ ) {

    //players can invite players, this is to simulate non organic growth
    if (nextIncrease > 0) {

        nextIncrease--;
        console.log("------- DIA "+dayz+' players '+_w.playerDatas.length+'--------')
        let dayUpdates = _w.updatePlayerDay(dayz);

        console.log("------- randomPlayerSampleAcrossPockets DIA "+dayz+' --------')

        //console.log(dayUpdates);
        //process.exit();
        let randomDayUpdatesFor = _w.randomPlayerSampleAcrossPockets(1);
        if (rDayUpdates = _w.updateRandomPlayerDay(day,randomDayUpdatesFor,[])) {

            _w.updatePlayerDataExchange(rDayUpdates);

        }
        //console.log(randomDayUpdatesFor);

        //process.exit();
        if (dayUpdates) {
            console.log("------- dayUpdates DIA "+dayz+' --------')
            let packetTransactions =_w.updatePlayerDataExchange(dayUpdates);
            console.log("packet transactions "+packetTransactions.length+' ')
            //process.exit();
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
console.log("-------SIMULATION END ("+runForDays+") days ");
_w.stats();
//loop days
    
    
    
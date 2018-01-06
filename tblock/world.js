var helpers = require ("./helpers.js")
var tBlockListContainer = require("./tblockTest.js");  //xmpp adapterus

var Player = require("./player.js");  //xmpp adapterus

var LocationGenerator = require("./locationGenerator.js");  //xmpp adapterus
var world = require("./world.js");  //xmpp adapterus

var _h = new helpers()
_und = require("underscore")

var LC = new LocationGenerator()

var world = function(){

    var me = this;
    this.playerDatas = [];
    this.week = 0;
    this.day = 0;
    this.blockID = 0;
}

world.prototype.addPlayer = function(player){

    this.playerDatas.push(player);

}
world.prototype.updatePlayerDataExchange = function (actions){

    //actions split by regions

    console.log(actions);
    process.exit();
    var pockets = self.getPockets(actions);

    

}

world.prototype.updatePlayerDataExchange = function (actions) {

    var pockets = this.getPockets(actions);
    var me = this;

    var packetTransactions = [];
    var totalData = 0;

    Object.keys(pockets).forEach(function(element, key, _array) {

        let pocket = pockets[element];
        //console.log(pocket)
    
    //console.log(pockets);
    //process.exit();
    //pass inside pocket
    packet = _und.shuffle(pocket);

    totalData = totalData + packet.length;

    var ex = true;
    while (ex) {

        if (aa=packet.pop()){
            if (bb=packet.pop()){

            } else {
                ex =false;
                break;
            }
        } else {
                ex =false;
                break;
            }

        //make exchange happen
        if ( p1 = me.getPlayer(aa.playerID)) {
            if ( p2 = me.getPlayer(bb.playerID) ) {


        //console.log(p1);
        //console.log(p2);
                //really simple now
                console.log(p1.playerID+ " pulls from "+p2.playerID)
                if ( missingFromMe = p1.requestMissingBlocks(p2) ){

                    res1 = p2.fetchMissingBlocks(p1,missingFromMe);
                    if (res1.length) {

                        packetTransactions.push(res1)
                        //console.log(res1);
                        

                    }
                } //do the dance of exchanging blocks

                console.log(p2.playerID+ " pulls from "+p1.playerID)

                 if ( missingFromMe2 = p2.requestMissingBlocks(p1) ){

                    res2 = p1.fetchMissingBlocks(p2,missingFromMe2);
                    if (res2.length) {

                        packetTransactions.push(res2)
                        //console.log(res2);
                        

                    }
                } //do the dance of exchanging blocks


            } else {
                ex =false;
                break;
            }
        } else {
                ex =false;
                break;
            }
        

        
        //add some randomness to stop this

    }   //pairs

    if (!ex) {
        console.log("uneven------------")
        //process.exit()
    }
    //console.log(packetTransactions.length);
    if (pocket.length) {
        //leftover loner
        //process.exit()
    }

    });   //loop all pockets

    console.log('Total data waiting to pass: '+totalData);
    console.log('passed dataitem pairs :'+packetTransactions.length)
    //console.log(this.tBlocks.list);
    
    
    //if (totalData > 100) { process.exit() }
    return packetTransactions;
}

world.prototype.getPacketDistanceStatistics = function(){

    var dis = [];
    for (f=0 ; f < this.playerDatas.length ; f++){
        
        let dd = this.playerDatas[f].getBlocksByDistance();
        if (dd) {
            dis.push(dd);
        }
    }



}


world.prototype.getPlayer = function(playerID) {

    for (f=0 ; f < this.playerDatas.length ; f++){
        if (this.playerDatas[f].playerID==playerID) {
            return (this.playerDatas[f]);
        }
    }
    return false;
}

world.prototype.activatePlayerPairDay = function(day,p1,p2) {

    //gets a list of players and updates their days
    //todo: multiple partners!
    p1.activateDayWithPartner(day,p2);
    p2.activateDayWithPartner(day,p1);
    return true;
}

world.prototype.updatePlayerDay = function(day,datas) {

    //gets a list of players and updates their days
    if (datas===undefined){
        datas = this.playerDatas;
    }

    var updapa = [];
    var noaction = [];
    for (var f=0 ; f < datas.length ; f++){

        let pdres = datas[f].updateDay(day);

        if (pdres) {
            //run was added
            updapa.push(datas[f]);
        } else {
            noaction.push([datas[f].playerID,datas[f].excerciseAfterDays])
        }
    }

    if (updapa.length) {
        this.reportPockets(updapa);
        return updapa;
    }

    console.log(noaction);
    return false;
}

world.prototype.updateRandomPlayerDay = function(day,players,ignoredPlayers) {

    //additional, random activity
    //non runners making a run
    //somebody introducing to a friend and making a run
    let activities = ['lazy_loner_run_with_friend','activateRandom','introduceToFriend',"idle",'jetsetChangesPocket'];
    var randActs = [];

    while (p=players.pop()){

        let a = _h.steepRandomFromChoices(activities.length);
        let act = activities[a];
        console.log(act);
        //process.exit();
        switch (act) {
            case 'idle': {
                continue
            }
            case 'lazy_loner_run_with_friend': {
                //non activating loner does a run with somebody
                if (loner = this.getLocalLoner(p)){
                    randActs.push([p.playerID])
                    randActs.push([loner.playerID])
                    this.activatePlayerPairDay(day,p,loner);
                    //loner.activateDayWithPartner(p);
                }
                //console.log(p);
                    //console.log(loner);
                    //process.exit();
                continue
            }
            case 'activateRandom': {
                //non activating loner does a run with somebody
                if (random = this.getLocalRandom(p)){
                    this.activatePlayerPairDay(day,p,random);
                    //random.activateDayWithPartner(p);
                    randActs.push([p.playerID])
                    randActs.push([random.playerID])
                }
                

                continue
            }

            case 'introduceToFriend': {

                let newFriends = this.addRandomPlayers(_h.randomIntFromInterval(1,4))
                randActs.push(p.playerID)
                while (mm = newFriends.pop()){
                    randActs.push([mm.playerID]);
                }
                
                //randActs.push([p.playerID,'introduceToFriend',newFriends])
                continue
            }
            case 'jetsetChangesPocket': {
                continue
            }

        }

    }
    console.log(randActs);
                    console.log('random exchanges '+randActs.length + ' out of '+this.playerDatas.length);
                    //process.exit();
    if (randActs.length==0) { return false; }

    //process.exit();
    return randActs
}   //updateRandomPlayerDay

world.prototype.getLocalLoner = function( partner ){

    let poc = this.getPockets(this.playerDatas);
    if (poc[partner.geoHash] == undefined ) {
        return false;
    }
    //console.log(poc[partner.geoHash]);
    let pos= this.getUserRoleFromGroup(poc[partner.geoHash],'loner')
    if (!pos) { return false }
    //returns random local loner
    //console.log(pos);
    //console.log('LONER');
    //process.exit();
    return pos.pop();

}

world.prototype.getLocalRandom = function( partner ){

    let poc = this.getPockets(this.playerDatas);
    if (poc[partner.geoHash] == undefined ) {
        return false;
    }
    //console.log(poc[partner.geoHash]);
    let pos= this.getUserexcerciserTypeFromGroup(poc[partner.geoHash],'random')
    if (!pos) { return false }
    //returns random local loner

    //console.log(pos);
    console.log('local random');
    //process.exit();

    return pos.pop();

}

world.prototype.getLocalPotato = function( partner ){

    let poc = this.getPockets(this.playerDatas);
    if (poc[partner.geoHash] == undefined ) {
        return false;
    }
    //console.log(poc[partner.geoHash]);
    let pos= this.getUserexcerciserTypeFromGroup(poc[partner.geoHash],'potato')
    if (!pos) { return false }
    //returns random local loner

    console.log(pos);
    console.log('POTATO');
    process.exit();

    return pos.pop();

}

world.prototype.getUserRoleFromGroup = function (group,role) {

    
    let r =[];
    let le = group.length;

    console.log('SID '+le+ ' role ' + role);
   
    

    if (le==0){ return false; }
    for (f=0; f<le; f++){

        //console.log(group[f]);
        //process.exit();
        if (group[f].role == role) {
            r.push(group[f])
        }

    }

    //console.log(r);
    //process.exit();

    if (r.length==0){ return false; }
    return _und.shuffle(r);

    //me.role = "looper"  //librarian looper jetset
    //me.excerciserType = ''; //how frequent a mover
    //["jetset","looper","loner"]
    //let roles = ["weekender","steadfast","random","potato"]
}

world.prototype.getUserexcerciserTypeFromGroup = function (group, excerciserType) {

    let r =[];
    let le = group.length;

    console.log('SIsD '+le+' '+excerciserType);
    
    if (le==0){ return false; }
    for (f=0; f<le; f++){
        //console.log(group[f].excerciserType);
        if (group[f].excerciserType == excerciserType) {
            r.push(group[f])
        }

    }
    //console.log(r);
    //process.exit();

    if (r.length==0){ return false; }
    return _und.shuffle(r);

    //me.role = "looper"  //librarian looper jetset
    //me.excerciserType = ''; //how frequent a mover
    //["jetset","looper","loner"]
    //let roles = ["weekender","steadfast","random","potato"]
}


world.prototype.getPockets = function ( data ) {

    if (data == undefined) { data = this.playerDatas }
    var o = {};
    for (f=0 ; f < data.length ; f++){
        let p = data[f];
        if ( o[p.geoHash]== undefined ){
            o[p.geoHash] = [];
        }
        o[p.geoHash].push(p);

    }

    return o;
}

world.prototype.reportPockets = function(data){

    let pockets = this.getPockets(data);
    let me =this;
    //event every quarter, new users appear
    //console.log(pockets)
    //return;
    //loop every pocket
    Object.keys(pockets).forEach(function(element, key, _array) {

        //console.log(element +" ; "+ pockets[element].length)
        let ut = me.reportUserRoles(pockets[element]);

    });

}

world.prototype.reportUserRoles = function (group){

    var o = {};
    for (f=0 ; f < group.length ; f++){
        let p = group[f];
        if ( o[p.role]== undefined ){
            o[p.role] = [];
        }
        o[p.role].push(p.playerID);

    }

    Object.keys(o).forEach(function(element, key, _array) {

        console.log(element +" ; "+ o[element].length)
        
    });

    return o;

}

world.prototype.addRandomPlayers = function(howmany) {

    var res = [];
    for (var f =0 ; f < howmany; f ++) {

    let ua = _h.randomIntFromInterval(0,3);
    let ls = _h.randomIntFromInterval(1,LC.list.length);
    let loc = LC.list[ls-1];
    //console.log(loc);
    for ( ff=0; ff< ua; ff++ ){

        let np = new Player();
        let plid = "P"+f+":"+ff+"_"+loc;

        np.initialize(loc,plid);
        np.privateKey = "PRIVk_"+plid;
        np.publicKey = 'PUBk_'+plid;
        np.role = randomRole();
        np.excerciserType = randomExcerciserType(); //how many times
        np.updateNextRunSchedule(); //schedule first run to future
        let tb = new tBlockListContainer(np.publicKey,np.privateKey)
        np.tBlocks = tb;
        this.addPlayer(np);

        res.push(np);
        //playerData.push(np)
        }
    }

    return res;

}

world.prototype.randomPlayerSampleAcrossPockets = function(percent){

    let am = this.playerDatas.length;
    //todo: balace steadfast moves, etc..
    let tots = (am/100) * percent;

    console.log(tots);
    let sel = [];
    while (tots>0){

        let ua = _h.randomIntFromInterval(0,am-1);
        sel.push(this.playerDatas[ua])
        tots--;
    }

    return sel;

}

world.prototype.playerActivityStats = function (group) {

    let TotalPlayers = group.length;
    var ranking = [];

    for (f=0 ; f < TotalPlayers ; f++){
        let p = this.playerDatas[f];
        if ( ab = p.getOwnBlocks()) {
            //console.log(ab);
            ranking.push([ab.length,p.playerID]);

        }   //

    }

    if (ranking.length==0 ) { return false; }

    ranking.sort(function(a, b){return b[0]-a[0]});
    //console.log(ranking);
    var r2 =[];
    for (var f=0 ; f < ranking.length ; f++){
        let rk = ranking[f][1];
        //console.log(rk);
        if (p = this.getPlayer(rk)){
            r2.push(p);
        }
        
    }

    
    if (r2.length==0 ){ return false;}

    //console.log('ranking '+r2.length);
    //process.exit();

    return r2;  //nicely ordered from most to least active

    console.log(r2);
    console.log("tilt");
    process.exit()
    

    return r;

    //sort

}

world.prototype.stats = function(howmany) {

    let TotalPlayers = this.playerDatas.length;
    let TotalBlocks = 0;
    var totalBlocksSent = 0;
    var totalBlocksReceived = 0;
    let allBlockUsersArray = [];
    let allBlockdArray = [];
    let zombiePlayers = [];
    let storingPlayers = [];
    let storedBlocks = [];
    var activePlayers = [];
    for (f=0 ; f < TotalPlayers ; f++){
        let p = this.playerDatas[f];
        let ab = p.getAllBlocks();
        if (ab.length == 0) {
            
            zombiePlayers.push(p);
            continue;
        }
        activePlayers.push(p);
        let as = p.getStoredBlocks();
        if (as) {
            while (tt=as.pop() ){
                storedBlocks.push(tt);
            }
            storingPlayers.push(p);
        }
        totalBlocksSent = totalBlocksSent + p.blocksSent;
        totalBlocksReceived = totalBlocksReceived + p.blocksReceived;
        TotalBlocks = TotalBlocks + ab.length;
        //allBlockArray.push(p.getAllBlocks())
        for (ff=0 ; ff < ab.length ; ff++){
            allBlockdArray.push(ab[ff]) //will cause duplicates
        }
    }
    //console.log(allBlockArray);
    let pockets = this.reportPockets(this.playerDatas);
    var acsample = [];

    if (activePlayerStat = this.playerActivityStats(activePlayers)){
        //list of active players
        //show top 15%

        
        let fper = activePlayerStat.length * 0.15;
        
        for (var f = 0; f < fper; f++ ){
            acsample.push(activePlayerStat[f]);
        }

        //console.log("activePlayerStat "+acsample.length+' '+fper);
        //process.exit();
    }

    console.log("--------WOrld stats");
    console.log("TotalPlayers "+TotalPlayers);
    console.log("TotalBlocks "+TotalBlocks );
    console.log("TotalBlocksSent "+totalBlocksSent );
    console.log("TotalBlocksReceived "+totalBlocksReceived );

    console.log("Storing players "+storingPlayers.length );
    console.log("Stored blocks "+storingPlayers.length );

    //console.log("pockets "+pockets.length);
    if (acsample.length){

        console.log("___user roles for Most Active");
        this.reportUserRoles(acsample);

    }

    console.log("___user roles for all");
    this.reportUserRoles(this.playerDatas);

    console.log("___zombies with no runs "+zombiePlayers.length);
    this.reportUserRoles(zombiePlayers);


}

if (typeof module !== 'undefined' ) {
	module.exports = world;
}
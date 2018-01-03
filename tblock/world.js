var helpers = require ("./helpers.js")
var tBlockListContainer = require("./tblockTest.js");  //xmpp adapterus

var Player = require("./player.js");  //xmpp adapterus

var LocationGenerator = require("./locationGenerator.js");  //xmpp adapterus
var world = require("./world.js");  //xmpp adapterus

var _h = new helpers()

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

world.prototype.updatePlayerDay = function(day) {

var updapa = [];
var noaction = [];
    for (var f=0 ; f < this.playerDatas.length ; f++){

        let pdres = this.playerDatas[f].updateDay(day);

        if (pdres) {
            //run was added
            updapa.push(this.playerDatas[f]);
        } else {
            noaction.push([this.playerDatas[f].playerID,this.playerDatas[f].excerciseAfterDays])
        }
    }

    if (updapa.length) {
        this.reportPockets(updapa);
        return updapa;
    }

    console.log(noaction);
    return false;
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

        console.log(element +" ; "+ pockets[element].length)
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

    for (var f =0 ; f < howmany; f ++) {

    let ua = _h.randomIntFromInterval(3,15);
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
        //playerData.push(np)
        }
    }

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

    for (f=0 ; f < TotalPlayers ; f++){
        let p = this.playerDatas[f];
        let ab = p.getAllBlocks();
        if (ab.length == 0) {
            
            zombiePlayers.push(p);
        }

        let as = p.getStoredBlocks();
        if (as.length == 0) {
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

    console.log("--------WOrld stats");
    console.log("TotalPlayers "+TotalPlayers);
    console.log("TotalBlocks "+TotalBlocks );
    console.log("TotalBlocksSent "+totalBlocksSent );
    console.log("TotalBlocksReceived "+totalBlocksReceived );

    console.log("Storing players "+storingPlayers.length );
    console.log("Stored blocks "+storingPlayers.length );

    //console.log("pockets "+pockets.length);
   

    console.log("___user roles for all");
    this.reportUserRoles(this.playerDatas);

    console.log("___zombies with no runs "+zombiePlayers.length);
    this.reportUserRoles(zombiePlayers);


}

if (typeof module !== 'undefined' ) {
	module.exports = world;
}
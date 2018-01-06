var helpers = require ("./helpers.js")
var tBlock = require ("./tBlock.js")
var tBlockListContainer = require("./tblockTest.js");  //xmpp adapterus
var _h = new helpers()

_und = require("underscore")

var Player = function(){

    var me = this;
    me.playerID = ""
    me.publicKey ="";
    me.privateKey;
    me.tBlocks = [];
    me.knownPlayerPublicKeys = [];
    me.role = "looper"  //librarian looper jetset
    me.excerciserType = ''; //how frequent a mover
    me.excerciseAfterDays = 0;
    me.lastPlayedDay = 0 ;

    me.geoHash = ""
    me.created = 0;
    me.updated = 0;
    me.hash = "";
    me.tBlocks = new tBlockListContainer();
    me.blockCounter = 0;
    me.publicKeyList = [];  //received pkeys
    me.blocksSent = 0;
    me.blocksRelayed = 0;
    me.blocksReceived =0;
}

Player.prototype.initialize = function(geoHash,playerID){

    me=this;
    me.geoHash = geoHash
    //me.created = this.uxT()
     
    me.playerID = playerID;
    me.hash = playerID;
    me.publicKey = "PUB"+playerID
    me.privateKey = "PRI"+playerID

    me.tBlocks.initialize();

}

Player.prototype.updateNextRunSchedule = function(day){

        switch (this.excerciserType) {

        case "weekender" :

            this.excerciseAfterDays = 4+ _h.randomIntFromInterval(1,4);
        break;

        case "steadfast" :
            this.excerciseAfterDays = 2+ _h.randomIntFromInterval(1,2);

        break;
        case "random":
            
            this.excerciseAfterDays = 1+ _h.randomIntFromInterval(1,22);

        break;
        default:

        this.excerciseAfterDays= day +1000;
    

    }

}

Player.prototype.updateDay = function(day) {

    //["weekender","steadfast","random","potato"]

    let exDay = this.lastPlayedDay + this.excerciseAfterDays;

    if ( day > exDay ) {
        //triggers all sorts of stuff
        this.addRun(day);
        return true;
    }

    this.updateNextRunSchedule(day);

    return false;
}

Player.prototype.activateDayWithPartner = function (day, partner){

    this.addRun(day);
    this.updateNextRunSchedule(day);

    //force the data exchange elsewhere

    return true;
}

Player.prototype.addRun=function(day){

    this.updated = _h.uxT();
    var tb = new tBlock()
    tb.blockID = 'BL_'+this.blockCounter+'_'+this.playerID ;
    tb.blockHash = tb.blockID;
    tb.originatorKey =this.privateKey;   //fake decryption
    tb.timestamp = _h.uxT();
    tb.geoHash = this.geoHash;
    tb.paperTrail = [];
    tb.appendPaperTrailItem(this)
    //var distanceTravelled;
    //var TTL= 10; 
    this.lastPlayedDay = day;
    this.tBlocks.appendBlock(tb);
    //console.log(this.tBlocks);
}

Player.prototype.sendPublicKey=function(receiver){

    let t = _h.randomIntFromInterval(0,100);
    if (t<80) {
        receiver.receivePublicKey(this.publicKey);
    }

}

Player.prototype.sendTblock=function(receiver){

    let t = _h.randomIntFromInterval(0,100);
    if (t<80) {
        receiver.receiveTblock(this.publicKey);
    }

}

Player.prototype.receivePublicKey=function(sender){

    this.publicKeyList.push(sender.publicKey)
    
}

Player.prototype.receiveTblock=function(tBlock){

    tBlock.trustedByMe = tBlock.decryptWithPublicKeys(this.publicKeyList)

    if (tBlock.isMine(this.publicKey)) {
        return false;

    }

    if (tBlock.trustedByMe) {
        tBlock.TTL = tBlock.TTL + 5;
    }

    //tBlock.appendPaperTrailItem(this);
    
    //let euc = this.tBlocks.append(tBlock,this.publicKeyList)
    //false, TTLd or rejected
    //null - already exists

}

Player.prototype.requestMissingBlocks=function(receiver){

    //console.log(this.tBlocks.list)

    //simulate something going wrong
    if (_h.randomIntFromInterval(0,99)>95){
        
        return false;
    }

    if ( missi = receiver.replyMissingBlocks(this.tBlocks.list)){
        console.log('---------requestMissingBlocks');
        //console.log(missi)
        return missi
    }
    return false;
}

Player.prototype.replyMissingBlocks=function(list){

    //simulate something going wrong
    if (_h.randomIntFromInterval(0,99)>95){
        
        return false;
    }
    console.log('replyMissingBlocks-------');
    let missi = this.tBlocks.missingBlocks(list);
    //do some randomness here with the blocks and their ordering
    return missi;
    
}

Player.prototype.fetchMissingBlocks=function(receiver,missing){

    let successFullBlocks = [];

    //simulate pseudo random pulling approach
    let miso = _und.shuffle(missing);
    //console.log(miso)
    //console.log(receiver);
    

    while (blockID = miso.pop()){

        if (block = receiver.requestForMissingBlock(this,blockID)) {

            //logic about known hosts here?

            /*if (block.isMine(this.publicKey)){
                continue;
            }*/

            //this.tBlocks.checkPaperTrail

            let paptra = block.appendPaperTrailItem(this,receiver.publicKey);   //
            if (paptra==null){

                console.log('last entry on papertrail - skip ');
                continue;
            }
            let rz = this.tBlocks.appendBlock(block);

            if (rz === null) {
                
                console.log('existing block');
                process.exit()
                //new trails perhaps?
                if (this.tBlocks.checkForMerge(block,knownPlayerPublicKeys)){
                    console.log('merging block');
                    let mergedBlock = this.tBlocks.mergeBlock(block,knownPlayerPublicKeys);
                    process.exit()
                }

            }

            if (!rz && block.TTL<2 ) {

                //console.log(block);
                //console.log(this.role);
                
                //am i a pussy? if so, store block
                if (this.role == 'loner') {

                    console.log("I AM A PUSSY! im storing the timeouted block "+block.blockID)
                    let rzs = this.tBlocks.storeBlock(block);
                } else {

                    console.log("im not a PUSSY but a "+this.role+"! im dropping this block."+block.blockID)
                    let rzs = this.tBlocks.dropBlock(block);
                }

                //process.exit()
            } 

            successFullBlocks.push(blockID);
            //console.log(this.tBlocks.list);
            //process.exit()
        }

    }
    //keep track of transaction
    this.blocksReceived++;

    return successFullBlocks;
}

Player.prototype.requestForMissingBlock=function(sender,blockID){

    //simulate error
    //simulate something going wrong
    if (_h.randomIntFromInterval(0,99)>95){
        
        return false;
    }

    if (block =this.tBlocks.getBlock(blockID)) {
        
        //dont report stored blocks going outside
        //return stored blocks as non stored with ttl of 2 when
        //explicitly queried if i happen to have it

        if (block.stored == true) {

            //stored by me?

            let bc = _und.clone(block);
            bc.stored = false;
            bc.TTL = 2;

            me.blocksSent++;
   
            return bc;
        }

        if (!block.originatesFromMe(this.privateKey)){
            me.blocksRelayed ++;
            
        }

        me.blocksSent++;
        return block;
    }

    return false;

}


Player.prototype.receiveBlock=function(tBlock){

    //do i already have this exactly same block
    //if so drop identical block
    //dont grow ttl, having many copies of the packet on the net occurring again
    //does not prove anything

    //is it mine
    if (tBlock.originatesFromMe(this.privateKey)) {
        return this.receiveOriginatedBlock(tBlock)
    }

    var ins = tBlock.inspectPasser(this.knownPlayerPublicKeys)
    if (ins = 'DROP_UNKNOWN_ORIGIN') {

        return ins
    }

    //returns false for unopenable keys
    var ppl = tBlock.decryptListWithPublicKeys(this.knownPlayerPublicKeys)

    if (!ppl) {

        return this.storeBlockWithMyStrategy(tBlock);
    }

}   //end of receiveBlock

Player.prototype.receiveOriginatedBlock=function(tBlock){

    //i made this block, check if it has travelled far enough
    return true;

}

Player.prototype.storeBlockWithMyStrategy = function(tBlock) {

    //see my strategy for storing passing

    //basically reduce ttl.


}

Player.prototype.getBlocksByDistance = function(){
    
    //for statistics, track longest running packets and their routes
    if (this.tBlocks.list.length==0) { 
        //console.log('tBlocks 0!' )
        return false; }
    
    if (block =this.tBlocks.getBlocksByDistance()) {
        

        if (block[0][1]==1) { return false; }   //ignore
        console.log('getBlocksByDistance' +this.playerID)
        console.log('tBlocks ' +this.tBlocks.list.length)

        return block;
    }

    return false;
}

Player.prototype.getAllBlocks = function(){

    //if (this.tBlocks === undefined) { return false }
    //console.log('ZIR' +this.tBlocks.list.length);
    return this.tBlocks.list;

}


Player.prototype.getOwnBlocks = function(){
    
    //if (this.tBlocks === undefined) { return false }
    //console.log('ZIR' +this.tBlocks.list.length);
    return this.tBlocks.getOwnBlocks(this.privateKey);

}

Player.prototype.getStoredBlocks = function(){

    let lile = this.tBlocks.list.length;
    var sb = [];
    if (lile==0) { 
        //console.log('tBlocks 0!' )
        return false; 
    }

    //console.log("ZURR");
    //console.log(this.tBlocks.list);

    for (var f=0; f < lile ; f++) {
        let xx = this.tBlocks.list[f];
        //console.log(xx);
        //process.exit();
        if (xx.stored == true){
            sb.push(xx)
        }
    }

    if (sb.length == 0 ) { return false; }
    return sb;
}
//_____________________
//cache is optional

//snapshots, runs

//locationBasedCache

//dirty true/false
//updated
//cacheType
//filename

//sync operation

// dictionary geoHash key
// .hash
// .filename
// timestamp
// data Any, not saved

//getNearby(location,range)

//insert ()

//save to .caches

//load from .caches

if (typeof module !== 'undefined' ) {
	module.exports = Player;
}
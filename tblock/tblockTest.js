
_und = require("underscore")

var tBlockListContainer = function(privateKey,publicKey){

    var me=this;
    me.list = []
    me.misses = []
    me.droppedCache = [];

    me.privateKey = privateKey
    me.publicKey = publicKey

}

tBlockListContainer.prototype.initialize = function (){

    this.list = [];
    //console.log('init blocklist')
}

tBlockListContainer.prototype.appendBlock = function (tBlock,publicKeyList) {

    let ttl = tBlock.TTL - 1;
    console.log(" app blok ttl "+ttl);
    if (ttl ==0) { 

        console.log('timedout block');
        //process.exit()
        return false; 
    } //drop

    for (var i=0;i<this.list.count ; i++){
        if (this.list[i].blockID == tBlock.blockID) {
            return null;    //exists
        }
    }
    //distanceTravelled

    tBlock.TTL = ttl;

    this.list.push(tBlock);
    //console.log(this.list);
    //process.exit()
    return true;
}

tBlockListContainer.prototype.storeBlock = function (tBlock,publicKeyList) {

    //total PUSSIES get to store blocks while others drop

    tBlock.TTL = 1000000000;
    tBlock.stored = true;
    
    for (var i=0;i<this.list.count ; i++){
        if (this.list[i].blockID == tBlock.blockID) {
            
            this.list[i] = tBlock;
            return true;
        }
    }
    //distanceTravelled

    

    this.list.push(tBlock);
    //console.log(this.list);
    //process.exit()
    return true;
}

tBlockListContainer.prototype.isDropped = function(tBlock) {

    for (var i=0;i<this.droppedCache.count ; i++){
        if (this.droppedCache[i].blockID == tBlock.blockID) {
            return i;
        }
    }
    return false
}

tBlockListContainer.prototype.dropBlock = function (tBlock) {

    //im not a keeper of blocks man
    //drop and remember to ignore this one
    this.droppedCache.push(tBlock);
    var drip = false;
    for (var i=0;i<this.list.count ; i++){
        if (this.list[i].blockID == tBlock.blockID) {
            drip = i; break;
        }
    }

    if (drip==false) {
        return false;
    }

    //delete this
    delete(this.list[i]);

}

tBlockListContainer.prototype.checkForMerge = function(block,knownPlayerPublicKeys){

    //we have an exiting entry
    //check if we need to merge

    let cp = this.getBlock(block.blockID);
    if (!cp) { return false }   //this wont happen with js

    if (cp.paperTrail.length != block.paperTrail.length) {

        return true;
    }

    return false;
}

tBlockListContainer.prototype.mergeBlock = function(block,knownPlayerPublicKeys){

    //we have an exiting entry
    //this should go to block logic?

    let cp = this.getBlock(block.blockID);
    if (!cp) { return false }   //this wont happen with js

    //create a new block, 


}


tBlockListContainer.prototype.getBlock = function (blockID) {

    for (var f=0; f < this.list.length; f++ ) {

        if (this.list[f].blockID == blockID ) { return this.list[f]; }
    }

    return false;

}
tBlockListContainer.prototype.missingBlocks = function (list) {

    console.log('missingBlocks passed '+list.length)
    console.log('missingBlocks local '+this.list.length)
    var aa =[];
    for (var ix=0;ix<list.length ; ix++){
        //console.log(list[ix])
        aa.push(list[ix].blockID)
    }

    var bb=[];
    for (var iy=0;iy<this.list.length ; iy++){
         bb.push(this.list[iy].blockID)
    }

    //console.log(list);
    //console.log(this.list)

    //console.log(aa);
    //console.log(bb)

    let miss = _und.difference(aa,bb);
    //console.log(miss)
    //process.exit();
    if (miss.length) { return miss; }
    return false;

}

tBlockListContainer.prototype.getBlocksByDistance = function(publicKeyList){

    if (this.list.length==0) { return false ; }
    var r = [];
    for (var f=0; f < this.list.length; f++ ) {
        //console.log(this.list)
        r.push([this.list[f].blockID,this.list[f].getDistanceTravelled(publicKeyList)])
    }

    //console.log(r);
    //process.exit()
    r.sort(function(a, b){return b[1]-a[1]});
    //console.log(r);
    return r;
} 



tBlockListContainer.prototype.getLongestLoop = function (myPlayerID) {

    //this is cleartext now
    //lists shorter than 10 entries dont count?
    //get travelled distance
        //distance looks short if many keys are unopenable
    //get travelled time

    //a tblock that has passed many people and returns to origin is strong
    //increase its ttl and keep passing it on
    //what happens when somebody forges a tblock list?
    

}

var tBlcokListItem = function(){

    var me=this;
    var encryptionKey = '';
    var originatorID;
    var timestamp;
    var geoHash;
    var message = ''

    //pass few trusted playerIDS here?
    //or get that info from the tBlocks he passed

}

tBlcokListItem.prototype.decryptWithPublicKeys = function (knownPlayerPublicKeys){

    //try to open with public keys from people i know
    //fake for now
    var hit = false;
    for (i=0;i<knownPlayerPublicKeys.count ; i++){
        let tr = knownPlayerPublicKeys[i];
        if (this.encryptionKey == tr) {
            hit=true;
            break;
        }

    }

    if (!hit) { return false; }
    return this; 

}

tBlcokListItem.prototype.getAllBlocks = function(){

    return this.data;


}
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
	module.exports = tBlockListContainer;
}
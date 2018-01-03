var helpers = require ("./helpers.js")
var _h = new helpers()

var tBlock = function(){

    var me=this;
    me.blockID = '';
    me.blockHash = '';
    me.originatorKey ='';
    me.list = [];
    me.paperTrail = [];
    me.timestamp = 0;
    me.geoHash ="";
    me.distanceTravelled =0;
    me.TTL= 10;    //initial ttl 10 hops
                    //grow ttl when you know people on the list
                    //rubbish packets will timeout
                    //librarian might store them still
                    //send a downvote packet?
                    //forget originator if i know him
    me.stored = false;  //Pussies store blocks

}

tBlock.prototype.appendPaperTrailItem = function (player){
    
    let pl = this.paperTrail.length
    console.log(pl);
    if (pl){
        
        //console.log(n);
        //process.exit();

        //check for minimum size of loop until we accept a block back to be merged
        var bust = false
        for (var f = this.paperTrail.length-1; f >0 ; f-- ) {

            let n = this.paperTrail[f];
            if (n[0] == player.publicKey){
                bust = f;
                break;
            }
        }

        if (bust !== false ) {

            if (bust < 4) {
                return false;   //ignore this guy
            }

            return null;    //results to merge

            }
        }
        
    this.paperTrail.push([player.publicKey,player.geoHash,_h.uxT()])
    this.distanceTravelled = this.paperTrail.length;
    return true;
}

tBlock.prototype.getDistanceTravelled = function (publicKeys){

    return this.paperTrail.length;

}

tBlock.prototype.isMine = function (myPublicKey) {

    //console.log(myPublicKey + '' + this.paperTrail[0][0])
    //process.exit()
    //tb.paperTrail.push([this.publicKey,this.geoHash,_h.uxT()])  //first
    if (this.paperTrail[0][0]== myPublicKey) { 
        
        return true; }
    return false;

}

tBlock.prototype.decryptWithPublicKeys = function (knownPlayerPublicKeys){

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
    return true; 

}

tBlock.prototype.addSignedToList = function (){


}

tBlock.prototype.originatesFromMe = function (privateKey){

    return false;
}

tBlock.prototype.originatesFromMe = function (privateKey){

    if (this.originatorKey == privateKey) { return true }
    return false;
}

tBlock.prototype.inspectPasser = function (knownPlayerPublicKeys){

    //if i dont know who passed me this, ignore
    var tl = this.list.last;
    var tbe = tl.decryptWithPublicKeys(knownPlayerPublicKeys)
    if ( tbe=== false) {
        return "DROP_UNKNOWN_ORIGIN";  //ignore unknown passer
    }
    return false;
}

tBlock.prototype.decryptListWithPublicKeys = function (knownPlayerPublicKeys){

    var op = new tBlockListContainer()
    var hits = 0;
    let totkeys = this.list.count
    for (i=0; i< totkeys-1; i++) {
        let enc = this.list[i].decryptWithPublicKeys(knownPlayerPublicKeys);
        if (enc) { 
            hits++;
            op.list.push(enc) } else {
            op.misses.push(i);
        }
        //op.push(enc)  //false for no open
    } 

    if (hits==1) { return false; }  //all other items are unreachable

    return op;  //false for unaccessible
}

tBlock.prototype.decrypt = function (listItem, publicKey) {



}


if (typeof module !== 'undefined' ) {
	module.exports = tBlock;
}

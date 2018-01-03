
var helpers = function(){

}


helpers.prototype.distanceFromCoordToCoord = function (c1,c2){
    
    var R = 6371; // km
                var latDif = parseFloat(c1.lat) - parseFloat(c2.lat);
                var lonDif =  parseFloat(c1.lon) - parseFloat(c1.lon);
                var dLat = latDif.toRad();
                var dLon = lonDif.toRad();
                var lat1 = parseFloat(c1.lat).toRad();
                var lat2 = parseFloat(c.lat).toRad();

                var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                var d = R * c;

    return (d*1000)
}


helpers.prototype.debuMess = function(t){
	console.log(t);
}

helpers.prototype.debuObj = function(o){
	console.log(o);
}



helpers.prototype.uxT = function(o){

	//unix timestamp
	return  Math.round((new Date()).getTime() / 1000);

}

helpers.prototype.hasTimeoutExpired = function(timestamp,timeoutInMs){

	//if timestamp is not defined, this would mean the value has not been initialized
	if (timestamp===undefined) { return false;}
	if (timestamp===false) { return false;}
	//unis timestamp
	var now= Math.round((new Date()).getTime() / 1000);
	var dif = now-timestamp;
	if (dif<timeoutInMs) { return false; }
	return fe;
}


helpers.prototype.randomTrueFalse= function()
{
    return this.randomIntFromInterval(0,1)
}


helpers.prototype.steepRandomFromChoices= function(choices){

    let a = this.randomIntFromInterval(0,99);
    let steps = 100/choices;
    let ampStep = 0.1/steps;

    for (f=choices; f>0; f--){

        let stepa = steps*f;
        let zig = (100-(stepa*(0.093*f))) //))*(ampStep*f);

        //ampStep=ampStep+ampStep;
        //console.log(a + ' ' +zig + ' as '+stepa);
        if (a<zig) {
            return f-1;
        }
        
    }

    return choices-1;   
}

helpers.prototype.randomIntFromInterval= function(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

exports.helpers = helpers;

if (typeof module !== 'undefined' ) {
	module.exports = helpers;
}
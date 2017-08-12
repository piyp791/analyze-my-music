var conf = require('../config');
var async = require('async');
var querystring = require('querystring')

module.exports = {

  /*name: buildString
    
    param: obj:-> response returned from the http request to api endpoint, which is returned as an array of characters, 
            which on concatenation form the JSON object
    desc: concatenate the characters from the param obj to form a json string and return JSON object from that string
    
    returns: the JSON object for the response returned from api endpoint
  */
	buildString:function(httpResponseCharArr){
		//console.log(obj)

		var jsonStr = "";
  	for(var i in httpResponseCharArr) 
      jsonStr+=httpResponseCharArr[i]	
  	
    //console.log('jsonStr-->' +jsonStr)
    try{
      return JSON.parse(jsonStr);  
     
    }catch(ex){
      
      throw new Error('Error while parsing the concatenated http response string -->' +ex)
    }
  	
	},
  

	isStatusError:function(bodyJson){

		if(bodyJson.status.code!==0){
			//some error
			return true;
		}else{
			return false;
		}

	},

  extractInfo: function(responseJson){

    //features to extract : danceaiblity, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo
    keyList = ['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo', 'time_signature']
    preparedJson = {}

    //console.log('response json -->' +responseJson)
    for(var key in responseJson){
      //console.log('key-->' + key)
      if(keyList.indexOf(key)!=-1){
        //console.log('adding key ' +key + ' to new json')
        preparedJson[key] = responseJson[key]
      }
    }
    
    return preparedJson
  },

  encodeUrl: function(urlStr){

    //return encodeURI(urlStr)
    urlStr = querystring.escape(urlStr);
    return urlStr

  },

  filterTags: function(tag){

    tags = ['metal', 'popsoft', 'rock', 'classic rock', 'jazz', 'blues', 'classical', 'folk', 'country', 'edm', 'progressive rock', 'punk rock', 'rap', 'hip hop', 'easy listening', 
    'alternative', 'indie', 'british','american', '60s', '70s', '80s', '90s', '50s', 'electronic', 'electronica', 'acoustic', 'oldies', 'party', 'live']

    tag = tag.toLowerCase();

    for (var i=0;i<tags.length;i++){

      if(tags[i].includes(tag) || tag.includes(tags[i])){
        return 'True'
      }
    }

    return 'False'

  }
}


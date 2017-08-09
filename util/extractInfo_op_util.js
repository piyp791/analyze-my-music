var misc_util = require('./misc_op_util');
var trackInfoDto = require('../models/trackCompleteInfo_dto');

function setAcrInfo(genreObj){

	//console.log(genreObj.acrInfo.title);
	trackInfoDto.acrInfo.title = genreObj.acrInfo.title;
	trackInfoDto.acrInfo.album = genreObj.acrInfo.album;
	//objDto.acrInfo.song = genreObj.acrInfo.title;
	trackInfoDto.acrInfo.artists = genreObj.acrInfo.artists;
	trackInfoDto.acrInfo.genres = genreObj.acrInfo.genres;
}

function setDeezerInfo(genreObj){

	trackInfoDto.deezerInfo.genre = genreObj.deezerInfo;

}

function setWikiInfo(genreObj){

	trackInfoDto.wikiInfo.genre = genreObj.wikiInfo;
}

function setSpotifyInfo(genreObj){

	trackInfoDto.spotifyInfo = genreObj.spotifyInfo.body;
}

function setLastfmInfo(genreObj){

	trackInfoDto.lastfmInfo = genreObj.lastfmInfo
}

module.exports = {

	setGenreDtoObj:function(genreObj){

		setAcrInfo(genreObj); 

		setDeezerInfo(genreObj);

		setWikiInfo(genreObj);

		setSpotifyInfo(genreObj);

		setLastfmInfo(genreObj);

		return trackInfoDto

	},

	extractMetadataObj:function(bodyChar){

		var bodyJson = misc_util.buildString(bodyChar);
  
  		var metadata = bodyJson.metadata.music[0];

  		return metadata;
	}
}
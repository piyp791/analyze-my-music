module.exports = {


	app:{
		port:3000
	},

	fileUpload:{
		limits: { fileSize: 1 * 1024 * 1024 },
		uploadFolder: '/public/uploads/'
	},


	acr:{
		defaultOptions : {
			
	  		host: 'us-west-2.api.acrcloud.com',
	  		endpoint: '/v1/identify',
	  		signature_version: '1',
	  		data_type:'audio',
	  		//data_type:'fingerprint',
	  		secure: true,
	  		access_key: 'e552ad4337d66c7a2884235365335e90',
	  		access_secret: 'kFrFgRjwfXEES4VyN09GUUHqAm3FPRwR9vfd8enu'
		},	

		errorCodes:{
			1001:   'No Result',
            3001:   'Missing/Invalid Access Key',
			3002:	'Invalid ContentType. valid Content-Type is multipart/form-data',
			3003:	'Limit exceeded',
			3006:	'Invalid parameters',
			3011:	'metadata error',
			3014:	'InvalidSignature',
			3015:	'Could not generate fingerprint',
			3016:	'The file you uploaded was too large, we sugguest you cut large file to smaller file, 10-20 seconds audio file is enough to identify'
		}
	},

	deezer:{
		apiHomeEndpoint: 'http://api.deezer.com',
		genreEndPoint: '/genre/'
	},

	spotify:{
		credentials:{
			
			clientId : 'aeda8e473342414b8c919fddf52f24c3',
			clientSecret : 'f132559b2e5e4a6c9bcc383aafc7a2e5',
			redirectUri : 'http://localhost:3000/callback/'

		}
	},

	lastfm:{
		credentials:{

			apikey: '625a1295c0bde1bd445b4885d67b60ac'
		},

		keyWordValueMapping:{

			METHOD: 'method',
			GET_TRACK_INFO_METHOD: 'method=track.getInfo',
			ARTIST: 'artist',
			TRACK: 'track',
			API_KEY:'api_key',
			JSON_FORMAT:'format=json'
		},

		apiHomeEndpoint: 'http://ws.audioscrobbler.com/2.0/'
		
	},

	urlOptions:{

		urlParamDelimiter:'?',
		paramDelimiter:'&'
	}
	
}
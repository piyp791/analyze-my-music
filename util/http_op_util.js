var request = require('request')

module.exports = {

	fetchHttpResponse:function(url, type, formData){

		return new Promise(function(resolve, reject){

			if((!type) || (type === 'get')){
				request.get(url, function(error, response, body){

					if(error || response.statusCode!==200) reject(error)

					resolve(body)				
				});	
			}

			else if(type === 'post'){
				request.post({url: url, formData: formData}, function(error, response, body){

					if(error || response.statusCode!==200) reject(error)

					resolve(body)				
				});
			}
			
		});
	}
}


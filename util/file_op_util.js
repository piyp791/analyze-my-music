var conf = require('../config');
var fs = require('fs');


module.exports = {

	readFile:function(filePath){

		var buffer = fs.readFileSync(filePath);
		return buffer;
	},

	buildString:function(obj){
		//console.log(obj)

		var jsonStr = "";
  		for(var k in obj){
  			jsonStr+=obj[k]
  			//console.log(" values: " + obj[k]);	
  		} 
  		//console.log('jsonStr-->' +jsonStr)
  		return JSON.parse(jsonStr);
	},

	executePythonScript: function(script, options, callback){

		PythonShell.run(script, options, function (err, results) {
  			if (err) callback(err, null)

  			//console.log('results-->' +results)
  			//console.log('finished');
  			callback(null, results)

		});
	},

	isStatusError:function(bodyJson){

		if(bodyJson.status.code!==0){
			//some error
			return true;
		}else{
			return false;
		}

	},

	rmDir :function(dirPath, removeSelf) {

	  console.log('rmDir called with dirPath:!!' + dirPath)
      if (removeSelf === undefined)
        removeSelf = false;
      try { 
      	var files = fs.readdirSync(dirPath); 
      }
      catch(e) 
      	{ 
      		console.log(e)
      		return; 
      	}
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + files[i];
          console.log('file -->' +filePath)
          if (fs.statSync(filePath).isFile()){
          	fs.unlinkSync(filePath);
        	console.log('deleted file -->' +filePath)
          }
          else
            rmDir(filePath);
        }
      if (removeSelf)
        fs.rmdirSync(dirPath);
    },

    areMultipleFiles: function(dirPath){
    	
    	console.log('check number of files called for dir path-->' +dirPath)
    	try { 
      		var files = fs.readdirSync(dirPath); 
      	}
      	catch(e) 
      	{ 
      		console.log(e)
      		return; 
      	}

      	return files.length>1;

    },

    returnFilesFromPath:function(dirPath){

    	var files = fs.readdirSync(dirPath); 
    	var resultFiles = []
    	for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + files[i];
          console.log('file -->' +filePath)
          if (fs.statSync(filePath).isFile()){
          	//fs.unlinkSync(filePath);
        	//console.log('deleted file -->' +filePath)
        	resultFiles.push(files[i])
          }
          else{
          	
          }
            //rmDir(filePath);
        }

        return resultFiles;
    }
}


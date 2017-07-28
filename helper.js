var fs = require('fs');
var _ = require('lodash');
var path = require('path');

exports.createDirIfNotExists =  function createDirIfNotExists(path) {
	if(!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

exports.ensureDirectoryExistence = function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

exports.getUserHome =  function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

exports.formate = function formate(input, result) {
	let pattern = /<<(\w*)\s*(\w*)>>/gm;
	while (matches = pattern.exec(input)) {
		if(matches[2]) {
            //formatting added
			let functionName = matches[1];
			let varName = matches[2];
			input = input.replace(`${functionName} `, '')
					.replace(`<<${varName}>>` ,'${exports.' +functionName + '(result.' + varName + ')}')
		} else {
	 	    input = input.replace(matches[0], '${result.'+ matches[1]+ '}');
		}
 	}
 	return eval('`'+input+'`', result);
}


exports.lowerCase= function lowerCase(value) {
	return value.toLowerCase();
}

exports.kebabCase = function kebabCase(value) {
	return _.kebabCase(value);
}

exports.camelCase = function camelCase(value) {
	return _.camelCase(value);
}

exports.capCase = function capCase(s){
    return s[0].toUpperCase() + s.slice(1);
}

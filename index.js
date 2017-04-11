var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');

var colors = require("colors/safe");

var generator = require('./template.js').generator;

var generatorPrompets = generator.prompts.map(e=> e.name)

prompt.message = colors.rainbow("Question!");
prompt.delimiter = colors.green("><");

prompt.start();

prompt.get(generatorPrompets, function (err, result) {
	// console.log(result.name);

	generator.actions.forEach((a)=> {
		if(a.type === 'add') {
			try {  
			    var data = fs.readFileSync(a.template, 'utf8');
			    let destination = formate(a.path, result);
			    console.log(destination);
			    let formattedOutput = formate(data,  result);
			    console.log(formattedOutput);
			    fs.writeFile(destination, formattedOutput, function(err) {
				    if(err) {
				        return console.log(err);
				    }
				    console.log("The file was saved!");
				}); 


			} catch(e) {
			    console.log('Error:', e.stack);
			}
		}
	})
});


function formate(input, result) {
	// console.log(input)
	let pattern = /<<(\w*)\s*(\w*)>>/gm;

	while (matches = pattern.exec(input)) {
		console.log(matches);
		console.log(matches.length);
		if(matches[2]) {//formatting added
			console.log(0);
			let functionName = matches[1];
			let varName = matches[2];
			input = input.replace(`${functionName} `, '')
					.replace(`<<${varName}>>`
						,'${' +functionName + '(result.' + varName + ')}')
					// .replace('<<${m[2]}>>', '${result.'+ matches[1]+ '}');
			console.log(input);
			// console.log(0);

		} else {
	 	    input = input.replace(matches[0], '${result.'+ matches[1]+ '}');
	 	    console.log(1);
		}
 	}

 	return eval('`'+input+'`', result);
}


function lowerCase(value) {
	return value.toLowerCase();
}

function kebabCase(value) {
	return _.kebabCase(value);
}

function camelCase(value) {
	return _.camelCase(value);
}

function capCase(s)
{
    return s[0].toUpperCase() + s.slice(1);
}

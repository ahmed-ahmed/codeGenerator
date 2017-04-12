#!/usr/bin/env node

const generatorsLoacation = `${getUserHome()}/.gen`;

var path = require('path');
var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');
var chalk       = require('chalk');
var clear       = require('clear');
var figlet      = require('figlet');
var mkdirp = require('mkdirp');

// get all generators names 
var gens = fs.readdirSync(generatorsLoacation+ '/');
//////////////////////////
clear();
console.log(
  chalk.yellow(
    figlet.textSync('Gen', { horizontalLayout: 'full' })
  )
);

// showing all the available generators
let inquirer = require('inquirer');
var question = [{
    type: 'list',
    name: 'size',
    message: 'Which generator do you want to use?',
    choices: gens,
}];

inquirer.prompt(question).then(function (answers) {
	var selectedGenerator = `${generatorsLoacation}/${answers.size}`
	var colors = require("colors/safe");
	var generator = require(`${selectedGenerator}/index.js`).generator;
	var generatorPrompets = generator.prompts.map(e=> e.name)

	prompt.message = colors.rainbow("Question!");
	prompt.delimiter = colors.green("><");

	prompt.start();

	prompt.get(generatorPrompets, function (err, result) {
		generator.actions.forEach((a)=> {
			if(a.type === 'add') {
				try {  
				    var data = fs.readFileSync(`${selectedGenerator}/${a.template}`, 'utf8');
				    let destination = formate(a.path, result);
				    console.log(destination);
				    let formattedOutput = formate(data,  result);

					ensureDirectoryExistence(destination);
				    // mkdirp.sync(destination)

				    fs.writeFileSync(destination, formattedOutput);
				} catch(e) {
				    console.log('Error:', e.stack);
				}
			}
		})
	});
})

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}


// function mkdirp(filepath) {
//     var dirname = path.dirname(filepath);

//     if (!fs.existsSync(dirname)) {
//         mkdirp(dirname);
//     }

//     fs.mkdirSync(filepath);
// }


function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function formate(input, result) {
	// console.log(input)
	let pattern = /<<(\w*)\s*(\w*)>>/gm;

	while (matches = pattern.exec(input)) {
		if(matches[2]) {//formatting added
			let functionName = matches[1];
			let varName = matches[2];
			input = input.replace(`${functionName} `, '')
					.replace(`<<${varName}>>`
						,'${' +functionName + '(result.' + varName + ')}')
					// .replace('<<${m[2]}>>', '${result.'+ matches[1]+ '}');

		} else {
	 	    input = input.replace(matches[0], '${result.'+ matches[1]+ '}');
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

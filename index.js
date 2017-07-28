#!/usr/bin/env node
var prompt = require('prompt');
var fs = require('fs');

var chalk       = require('chalk');
var clear       = require('clear');
var figlet      = require('figlet');
var mkdirp = require('mkdirp');
var helper = require('./helper')
var argv = require('minimist')(process.argv);


var install = argv['install'];// | argv['i']
const generatorsLoacation = `${helper.getUserHome()}/.gen`;


if(install) {
	var dir = install.split('/')[1];
	let destination = `${generatorsLoacation}/${dir}/`
	console.log(destination);
	helper.ensureDirectoryExistence(destination+ '/index.js');

	var simpleGit = require('simple-git')(destination);

	simpleGit.clone(`https://github.com/${install}`, destination)

	process.exit();
}

// get all generators names 
helper.createDirIfNotExists(generatorsLoacation);
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
				    let destination = helper.formate(a.path, result);
				    console.log(destination);
				    let formattedOutput = helper.formate(data,  result);

					helper.ensureDirectoryExistence(destination);
				    // mkdirp.sync(destination)

				    fs.writeFileSync(destination, formattedOutput);
				} catch(e) {
				    console.log('Error:', e.stack);
				}
			}
		})
	});
})

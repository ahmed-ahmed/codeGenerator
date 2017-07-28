#!/usr/bin/env node
var prompt = require('prompt');
var fs = require('fs');
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var mkdirp = require('mkdirp');
var helper = require('./helper')
var argv = require('minimist')(process.argv);
let inquirer = require('inquirer');
var colors = require("colors/safe");

// setup 
var install = argv['install'];// | argv['i']
const generatorsLoacation = `${helper.getUserHome()}/.gen`;
clear();
console.log(
  chalk.yellow(
    figlet.textSync('Gen', { horizontalLayout: 'full' })
  )
);


// first question 
whatDoyouWantToDo();

function whatDoyouWantToDo() {
	var actions = ['1. Install generator', '2. Generate Code'];
	var question = [{
		type: 'list',
		name: 'action',
		message: 'What do you want to do?',
		choices: actions,
	}];

	inquirer.prompt(question).then(function (answer) {
		if (answer.action === actions[0]) {
			//install
			prompt.message = colors.green("Please enter the github repo name for the generator to install");
			prompt.delimiter = colors.green("><");
			prompt.start();
			prompt.get("repo", function (err, result) {
				try {
					let destination = `${generatorsLoacation}/${result.repo}/`
					helper.ensureDirectoryExistence(destination + '/index.js');
					var simpleGit = require('simple-git')(destination);
					simpleGit.clone(`https://github.com/ahmed-ahmed/${result.repo}`, destination)
				} catch(err) {
					clear();
					console.log(chalk.red("Generator Was installed"));	
				}
				clear();
				console.log(chalk.yellow(figlet.textSync('Gen', { horizontalLayout: 'full' })));
				console.log(chalk.green("Generator Was installed"));

				return whatDoyouWantToDo();
			});
		}
		if (answer.action === actions[1]) {
			var gens = fs.readdirSync(generatorsLoacation+ '/');
			let question = {
				type: 'list',
				name: 'size',
				message: 'Which generator do you want to use?',
				choices: gens,
			}
 			inquirer.prompt(question).then(function (answers) {
				console.log(answer.action)
				var selectedGenerator = `${generatorsLoacation}/${answers.size}`
				var colors = require("colors/safe");
				var generator = require(`${selectedGenerator}/index.js`).generator;
				var generatorPrompets = generator.prompts.map(e=> e.name)
				console.log('---------------------------------')
				prompt.message = colors.rainbow("Question!");
				prompt.delimiter = colors.green("><");

				prompt.start();

				prompt.get(generatorPrompets, function (err, result) {
					generator.actions.forEach((a)=> {
						if(a.type === 'add') {
							try {  
								var data = fs.readFileSync(`${selectedGenerator}/${a.template}`, 'utf8');
								let destination = helper.formate(a.path, result);
								let formattedOutput = helper.formate(data,  result);
								helper.ensureDirectoryExistence(destination);
								fs.writeFileSync(destination, formattedOutput);
							} catch(e) {
								console.log('Error:', e.stack);
							}
						}
					})
				});
			})
		}
	});
}


// // get all generators names 


// inquirer.prompt(question).then(function (answers) {
// 	var selectedGenerator = `${generatorsLoacation}/${answers.size}`
// 	var colors = require("colors/safe");
// 	var generator = require(`${selectedGenerator}/index.js`).generator;
// 	var generatorPrompets = generator.prompts.map(e=> e.name)

// 	prompt.message = colors.rainbow("Question!");
// 	prompt.delimiter = colors.green("><");

// 	prompt.start();

// 	prompt.get(generatorPrompets, function (err, result) {
// 		generator.actions.forEach((a)=> {
// 			if(a.type === 'add') {
// 				try {  
// 				    var data = fs.readFileSync(`${selectedGenerator}/${a.template}`, 'utf8');
// 				    let destination = helper.formate(a.path, result);
// 				    console.log(destination);
// 				    let formattedOutput = helper.formate(data,  result);

// 					helper.ensureDirectoryExistence(destination);
// 				    // mkdirp.sync(destination)

// 				    fs.writeFileSync(destination, formattedOutput);
// 				} catch(e) {
// 				    console.log('Error:', e.stack);
// 				}
// 			}
// 		})
// 	});
// })

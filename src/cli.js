import arg from 'arg';
import inquirer from 'inquirer';

function parseargs(rawArgs){
    const args = arg(
        {
          '--git':Boolean,
          '--yes': Boolean,
          '--g': '--git',
          '-y': '--yes',
          '-i': '--install'  
        },
        {
            argv: rawArgs.slice(2),
        }
    )
    return{
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false
    }
}


async function promptMiss(options){
    const defaultTemp = 'Say Something dawg';
    if (options.skipPrompts){
        return{
            ...options,
            template: options.template || defaultTemp,
        }
    }
    const questions = [];
    if (!options.template){
        questions.push({
            type: 'list',
            name: 'template',
            message: 'Please choose a project template',
            choices: ['JavaScript', 'TypeScript', 'Ruby'],
            default: defaultTemp,
        })
    }
    if(!options.git){
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repo',
            default: false,
                })
    }

    const answers = await inquirer.prompt(questions)
    return{
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
    }
}
export async function cli(args){
    let options = parseargs(args)
    options = await promptMiss(options)
    console.log(options)
}
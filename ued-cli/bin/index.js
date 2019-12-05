#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const gmodule = require('../commands/generateModule');
const build = require('../commands/build');
const shell = require('shelljs');
const inquirer = require('inquirer');
const client = require('scp2');

let config = {};
if(fs.existsSync(path.resolve('meet.config.js'))){
    config = require(path.resolve('meet.config.js'));
}

program.version('1.0.0', '-v, --version');

program
  .command('new [module]')
  .description('generator a new module')
  .action(function(module){
    console.log('start generate new module')
    gmodule(config, module);
  })

program.command('build [password]')
  .description('git build specify module and assets upload to CDN')
  .action(function(pwd){
    if(!pwd){
      inquirer.prompt([
        {
          name:'password',
          message:'Input password',
          type:'Password'
        }
      ]).then(answer => {
        let result = shell.exec('npm run build');
        if(result.code === 0){
          client.scp('dist/', {
            host:'172.16.81.64',
            username:'web',
            password: answer.password,
            path:'/cvbs/web/dist'
          }, err => {
            console.log(err);
          })  
        }
      })
    }
    
  })

program.parse(process.argv);
#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const build = require('../commands/build');
const shell = require('shelljs');
const inquirer = require('inquirer');
const client = require('scp2');
const ssh2 = require('ssh2');

const {Client} = ssh2;
let config = {};
if(fs.existsSync(path.resolve('meet.config.js'))){
    config = require(path.resolve('meet.config.js'));
}

program.version('1.0.0', '-v, --version');

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
            
        }
      })
    }
    
  })

program.command('publish')
  .action(function(){
    client.scp('dist/', {
      host:'172.16.81.64',
      username:'web',
      password: 'smart',
      path:'/cvbs/web/dist'
    }, err => {
      let conn = new Client();
      conn.on('ready', function(){
        console.log('Client :: ready');
        conn.exec('ls', function(err, stream){
          if(err){
            throw err;
          }
          stream.on('close', function(code, signal){
            console.log('Stream :: close :: code ' + code + 'signal: ' + signal);
            conn.end();
          }).on('data', function(data){
            console.log('stdout:: ' + data);
          })
        })
      }).connect({
        host:'172.16.81.64',
        username:'web',
        password:'smart'
      })
    })
    
  })

program.parse(process.argv);
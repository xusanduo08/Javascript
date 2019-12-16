#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
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

program.command('publish [pwd]')
  .action(function(pwd){
    console.log('Uploading...');
    client.scp('dist/', {
      host:'172.16.81.64',
      username:'web',
      password: pwd,
      path:'/cvbs/web/dist'
    }, err => {
      if(err){
        throw err;
      }
      let conn = new Client();
      conn.on('ready', function(){
        console.log('Client :: ready');
        conn.exec('rm -rf r81;mv dist r81', function(err, stream){
          if(err){
            throw err;
          }
          stream.on('close', function(code, signal){
            console.log('Stream :: close :: code ' + code + 'signal: ' + signal);
            conn.end(); // 关闭socket链接
          }).on('data', function(data){
            console.log('stdout:: ' + data);
          })
        })
      }).connect({
        host:'172.16.81.64',
        username:'web',
        password: pwd
      })
    })
    
  })

program.parse(process.argv);
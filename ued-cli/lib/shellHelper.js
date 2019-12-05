const chalk = require('chalk');
const shell = require('shelljs');

// 执行一条shell命令
exports.exec = function(cmd, cb){
  let child_process = require('child_process');
  let parts = cmd.split(/\s+/g);
  // stdio: 子进程
  let p = child_process.spawn(parts[0], parts.slice(1), {stdio:'inherit'});
  p.on('exit', function(code){
    let err = null;
    if(code){
      err = new Error('command "' + cmd + '" exited with wrong status code "' + code + '"');
      err.code = code;
      err.cmd = cmd;
    }
    if(cb){
      cb(err);
    }
  })
}

exports.series = function(cmds, cb){
  let execNext  = function(){
    let cmd = cmds.shift();
    console.log(chalk.blue('run comand: ') + chalk.magenta(cmd));
    shell.exec(cmd, function(err){
      if(err){
        cb(err);
      } else {
        if(cmds.length){
          execNext()
        } else {
          cb(null);
        }
      }
    })
  }

  execNext();
};
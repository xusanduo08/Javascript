const shell = require('shelljs');
const chalk = require('chalk');
const shellHelper = require('../lib/shellHelper');

let config = {
  autoPublish: false
}

function build(meetConfig, module){
  Object.assign(config, meetConfig);
  if(typeof module === 'undefined'){
    console.log(chalk.read(`Module ${module} is undefined !`));
    return;
  }

  if(!shell.which('git')){
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
  }
  if(typeof config.getUrl === 'undefined' || config.url === ''){
    console.log(chalk.red('Sorry, your gitUrl is not defined in meet.config.js'));
    shell.exit(1);
  }

  console.log('building...');

  shellHelper.series([
    `${meetConfig.npmBuildCommand ? meetConfig.npmBuildCommand : 'npm run build '}${module}`
  ], function(err){
    if(err){
      console.log(chalk.red(err));
      process.exit(0);
    }

    console.log(chalk.green('Build finished!'));

    
  })
}

module.exports = build;
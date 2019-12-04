#!/usr/bin/env node
console.log('hello', process.argv);
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

let templatePath;
let targetRootPath;

function deleteFolderRecursive(path){
  if(fs.existsSync(path)){
    // readdirSync 同步读取目录内容
    fs.readdirSync(path).forEach(function(file, index){ // 删除path下的内容
      var curPath = path + '/' + file;
      if(fs.lstatSync(curPath).isDirectory()){
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    // rmdirSync 删除指定目录
    fs.rmdirSync(path); // 删除path目录
  }
}

function copyTemplates(name){
  function readAndCopyFile(parentPath, tempPath){
    let files = fs.readdirSync(parentPath);

    files.forEach(file => {
      let curPath = `${parentPath}/${file}`;
      let stat = fs.statSync(curPath);
      let filePath = `${targetRootPath}/${tempPath}/${file}`;
      if(stat.isDirectory()){
        fs.mkdirSync(filePath);
        readAndCopyFile(`${parentPath}/${file}`, `${tempPath}`)
      } else {
        const contents = fs.readFileSync(curPath, 'utf8');
        fs.writeFileSync(filePath, contents, 'utf8');
      }
    })
  }

  readAndCopyFile(templatePath, name);
}

function generateModule(meetConfig, name){
  templatePath = typeof meetConfig.moduleTemplatePath !== 'undefined' 
    ? path.resolve(meetConfig.moduleTemplatePath)
    : path.join(__dirname, '..', 'meet/module');
  targetRootPath = meetConfig.modulePath;
  let targetDir = path.join(targetRootPath, name);

  if(fs.existsSync(targetDir)){
    inquirer.prompt([
      {
        name: 'module-overwrite',
        type: 'confirm',
        message: `Module named ${name} is already existed, are you sure to overwrite?`,
        validate: function(input){
          if(input.lowerCase !== 'y' && input.lowerCase !== 'n'){
            return 'Please input y/n!';
          } else {
            return true
          }
        }
      }
    ]).then(answers => {
      console.log('answers', answers);
      if(answers['module-overwrite']){ // 确定覆盖
        deleteFolderRecursive(targetDir);
        console.log(chalk.yellow(`Module already existed, removing !`));

        fs.mkdirSync(targetDir);
        copyTemplates(name);
        console.log(chalk.green(`Generate new module ${name} finished !`));
      }
    }).catch(err => {
      console.log(chalk.red(err));
    })
  } else {
    fs.mkdirSync(targetDir);
    copyTemplates(name);
    console.log(chalk.green(`Generate new module ${name} finished !`));
  }
}

module.exports = generateModule;
const inquirer = require('inquirer');
const { doMain } = require('./likeByTags.js');
const { sortFollowers } = require('./getListFollowers.js');

inquirer
.prompt([
  {
    type: 'list',
    name: 'Instagrammeur',
    message: 'What do you want to do bro?',
    choices: [{name:`I want to know who follow me and I don't follow`,value:"aknowledge"}, {name:`liking some post based on my last post`,value:"like"}]
  }
])
.then(answers => {
  if(answers.Instagrammeur === "aknowledge"){
    sortFollowers();
  }else{
    doMain();
  }
});

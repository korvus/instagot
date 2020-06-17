const inquirer = require('inquirer');


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
    console.log("----------");
    console.log("type the command 'node getListFollowers.js'");
    console.log("----------");
  }else{
    console.log("----------");
    console.log("type the command 'node likeByTags.js'");
    console.log("----------");
  }
});

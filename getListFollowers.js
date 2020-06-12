const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');

const inquirer = require('inquirer');
const conf = require('dotenv').config();

function fakeSave(data) {
  return data;
}

function fakeExists() {
  return false;
}

function fakeLoad() {
  return '';
}

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(conf.parsed.ACCOUNT_LOGIN);
  // This function executes after every request
  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize();
    delete serialized.constants;
    fakeSave(serialized);
  });
  if (fakeExists()) {
    await ig.state.deserialize(fakeLoad());
  }
  // This call will provoke request.end$ stream
    const simonTshirt = await ig.account.login(conf.parsed.ACCOUNT_LOGIN, conf.parsed.ACCOUNT_PASSWORD);

    const userFeed = ig.feed.user(simonTshirt.pk);

    const accountFollowers = ig.feed.accountFollowers(simonTshirt.pk);
    const followers = await accountFollowers.items();

    const accountFollowing = ig.feed.accountFollowing(simonTshirt.pk);
    const following = await accountFollowing.items();

    var followersArray = followers.map(i => i.username);
    var followingsArray = following.map(i => i.username);

    // console.log("userFollowers", userFollowers);
    var IdontFollow = followersArray.filter(x => {return !followingsArray.includes(x)});
    var TheyDontFollowMe = followingsArray.filter(x => {return !followersArray.includes(x)});  


    inquirer
    .prompt([
      {
        type: 'list',
        name: 'Instagrammeur',
        message: 'What do you want to know bro?',
        choices: [{name:`They follow you but you don't follow them back`,value:"win"}, {name:`You follow them but they don't follow you back`,value:"lose"}]
      }
    ])
    .then(answers => {
      if(answers.Instagrammeur === "win"){
        console.log("----------");
        console.log(IdontFollow);
        console.log("----------");
      }else{
        console.log("----------");
        console.log(TheyDontFollowMe);
        console.log("----------");
      }
    });

})().catch(e => console.error(e));



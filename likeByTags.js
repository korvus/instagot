const { IgApiClient } = require('instagram-private-api');
const inquirer = require('inquirer');
var fs = require('fs');

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
  
function askIf (tags) {
  inquirer.prompt(question)
  .then(answers => {
    if(answers.hashtag){
      var hashtag = answers.hashtag.split('/');
      likeEach(hashtag, tags);
    } else {
      likeEach([], tags);
    }
  })
  .catch(e => {
    console.log("Error happened in askIf question, insite likeByTags script : ", e);
  })
}


const question = [
    {
      type:'input',
      name:'hashtag',
      message:'[>] You can add hashtags separate by some antislashs (/) if you want more (optionnal) :',
      validate: function(value){
        if(!value) return true;
        return true;
      }
    }
]


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
    
const getTagByUnit = (tags, iteration) => {
    return sleep(1000).then(() => tags[iteration]).catch(err => console.error("Promise failed at getTagByUnit function inside likeByTags.js file : ", err));
}


function extractHashtags(caption) {
  var regexp = /\B\#\w\w+\b/g
  var results = caption.match(regexp);
  if (results) {
      results = results.map(result => result.slice(1));
      return results;
  } else {
      return false;
  }
}

const doMain = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(conf.parsed.ACCOUNT_LOGIN);
  // This function executes after every request
  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize();
    delete serialized.constants;
    fakeSave(serialized);
  });
  if (fakeExists()) {
    await ig.state.deserialize(fakeLoad()).catch(e => console.error(e));
  }
  // This call will provoke request.end$ stream
  const simonTshirt = await ig.account.login(conf.parsed.ACCOUNT_LOGIN, conf.parsed.ACCOUNT_PASSWORD);
  
    const userFeed = ig.feed.user(simonTshirt.pk);
    const myPostsFirstPage = await userFeed.items();
    const captionToParse = myPostsFirstPage[0].caption.text;
    const hashtags = extractHashtags(captionToParse);

    console.log("Current hashtags of your last post are:");
    console.log(hashtags);

    askIf(hashtags);
    // control();
}

const likeEach = async (hashtag, tags) => {

  const ig = new IgApiClient();
  ig.state.generateDevice(conf.parsed.ACCOUNT_LOGIN);
  // This function executes after every request
  ig.request.end$.subscribe(async () => {
    const serialized = await ig.state.serialize();
    delete serialized.constants;
    fakeSave(serialized);
  });
  if (fakeExists()) {
    await ig.state.deserialize(fakeLoad()).catch(e => console.error(e));
  }
  // This call will provoke request.end$ stream
  const simonTshirt = await ig.account.login(conf.parsed.ACCOUNT_LOGIN, conf.parsed.ACCOUNT_PASSWORD);

  tags = hashtag ? tags.concat(hashtag) : tags

    const control = async _ => {
        console.log('--')

        for (let index = 0; index < tags.length; index++) {
            const tag = await getTagByUnit(tags, index);
            const tagFeed = ig.feed.tags(tag, "recent");
            let valid = true;
            const lastPostsOnHT = await tagFeed.items().catch(() => {valid = false;});
            if(!lastPostsOnHT.length) valid = false;

            if(valid === true){
              await ig.media.like({
                  mediaId: lastPostsOnHT[1].id,
                  moduleInfo: {
                    module_name: 'profile',
                    user_id: simonTshirt.pk,
                    username: simonTshirt.username,
                  }
              }).catch(e => console.error(e));
              console.log("- most recent post from #"+tag+" liked.");
            } else {
              console.error("- most recent post from #"+tag+" not liked because error in getting the last posts.");
            }

        }
        
        console.log('--')
    }

  control();


}

module.exports.doMain = doMain;
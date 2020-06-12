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
  
function askIf () {
  inquirer.prompt(question)
  .then(answers => {
    var hashtag = answers.hashtag.split('/');
    likeEach(hashtag);
  })
  .catch(e => {
    console.log(e);
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

let tags = fs.readFileSync('lastTags.txt', 'utf8');
tags = tags.split(",");


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
    
const getTagByUnit = iteration => {
    return sleep(1000).then(v => tags[iteration])
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

    askIf();
    // tags = tags.concat(hashtag);

    // control();

}

const likeEach = async (hashtag) => {
  
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


  tags = tags.concat(hashtag);
  
    const control = async _ => {
        console.log('--')

        for (let index = 0; index < tags.length; index++) {
            const tag = await getTagByUnit(index);
            var tagFeed = ig.feed.tags(tag, "recent");
            var lastPostsOnHT = await tagFeed.items().catch(e => console.error(e));

            await ig.media.like({
                mediaId: lastPostsOnHT[1].id,
                moduleInfo: {
                  module_name: 'profile',
                  user_id: simonTshirt.pk,
                  username: simonTshirt.username,
                }
            }).catch(e => console.error(e));
            console.log("- most recent post from #"+tag+" liked.")
        }
        
        console.log('--')
    }

    control();

}

doMain();


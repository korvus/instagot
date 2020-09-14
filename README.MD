# Instagram automated tasks runner

### warning
This is not an automated bot, nor an API, just a very specific and limited use of this more complete API: [instagram-private-api](https://github.com/dilame/instagram-private-api).
I made it as an exercise for my [Instagram Tshirt shop](https://www.instagram.com/simon.tshirt) dedicated to [simon.gallery](https://simon.gallery/shop) 
Here the tasks wich are executed, and quite asked by most of Instagramers I guess:
- A script for compare your followers and the user you follow (following).
IT will throw directly the difference (people you follow but they don't follow you) and opposite (people following you and you don't follow);
- A script to automatically like most recent post in specitic tags category. In fact, the tags are extracted from the text content from your last post on your account.

You must have some basics devlopment requirements if you want to use it:
- having node on your computer
- Know how to use a terminal :p
- That's all :)

### Install it
```npm i instagot```


### setup
You have to connect your Instagram account to the scripts.
To do so: 
- Create a .env file at the root level ;
- Enter the value for ACCOUNT_LOGIN and ACCOUNT_PASSWORD.

e.g :
```
ACCOUNT_LOGIN=myaccount
ACCOUNT_PASSWORD=secretPass123
```

### Use
Once settings done, you just have to go to this depository and run:
```
node index
```
Then, just follow the questions!

Feel free to improve it or customise it all the way you want ;)
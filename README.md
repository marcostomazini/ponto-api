## Prerequisites
Make sure you have installed all these prerequisites on your development machine.
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager, if you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages, in order to install it make sure you've installed Node.js and npm, then install bower globally using npm:

```
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process, in order to install it make sure you've installed Node.js and npm, then install grunt globally using npm:

```
$ sudo npm install -g grunt-cli
```

To install Node.js dependencies you're going to use npm again, in the application folder run this in the command-line:

```
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

## Liberando usuarios do sistema
Executar o mongo e acessar a base:

```
$ mongo
> show dbs
> use NOME_BASE
> db.users.find()
> db.users.find({"_id": ObjectId("55ed62263a35ec5e1177cddf")})
> db.users.update({"_id": ObjectId("55ed62263a35ec5e1177cddf")}, {$set: { ativo: true } })
```

Token: (password)
Authorization: Bearer H0g2Co+uvRQqRxprMtSsp16HWzTCfGTPOabR6DnVUxsoA/ZpNFoICGiuUa4ZgNAYz2TCZF+7gugFAGmmwHuKUA== 

Your application should run on the 3000 port so in your browser just go to [http://localhost:3000](http://localhost:3000)
                            
That's it! your application should be running by now, to proceed with your development check the other sections in this documentation. 
If you encounter any problem try the Troubleshooting section.

## Credits
Senior Developer [Marcos Tomazini](https://github.com/marcostomazini/)

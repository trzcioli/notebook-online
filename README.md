# notebook-online
Web application to create quick notes based on express web framework and MongoDB database.

You will need modules:    
express, express-session, pug, mongoose, body-parser, cookie-parser, morgan, moment, bcrypt    

To install nodejs:
```console
sudo apt install nodejs
```

To install npm:
```console
sudo apt install npm   
```

To install some of this modules you can use command:    
```console
sudo npm install ...    
```

To install mongodb you can enter to your console:   
```console
sudo apt-get install -y mongodb-org   
```

To start mongodb:   
```console
sudo service mongod start      
mongo    
```

To create database and collection:    
```console
use my-notebook       
db.createCollection("users")       
db.createCollection("notebooks")       
```

To add some data to database you can use this command:     
```console
node populatedb mongodb://localhost/my-notebook   
```

To run app you can enter command:    
```console
DEBUG=notebook-online:* npm run devstart    
```


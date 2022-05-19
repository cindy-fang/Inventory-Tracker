# Shopify-Internship-Fall-2022-Production-Engineer-Challenge

This is my submission for the 2022 Production Engineer internship coding challenge.

The technology used and will be required to be installed to build the code:

Node.js and Express.js 

After Node.js has been installed, follow these steps:

1. On your terminal, run git clone https://github.com/cindy-fang/2022-shopify-intern-challenge.git

2. We would need to inject the open weather API key onto the project for it to fully run. navigate to cd shopifyapp/server and create a file .env where the contents are:
OPEN_WEATHER_API_KEY= ***************

3. on the same directory shopifyapp/server run npm install to install all dependencies

4. Run npm start on the current directory

5. Open: localhost:5000 on any browser 

For Replit:

1. Go to the replit link!

2. I have already inserted the API KEY on the replit however, if this is not the case, then on the side tab of replit, navigate to the secrets tab and add the key:
Key: OPEN_WEATHER_API_KEY Value:***************

3. On the bottom right of replit, go to the shell tab and navigate to the server file by entering cd server

4. Install the dependencies by entering npm install

5. Enter npm start

6. Open localhost:5000 on the virutal browser 

Usage:

This is a web application that features an in-memory database that allows users to view inventory items.

Users can create inventory items

Users can update specific inventory items

Users can delete specific inventory items

Users can export the inventory item into a .csv file

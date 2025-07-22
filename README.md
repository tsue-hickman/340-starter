## Getting Started

This document is intended to get you started quickly in building a backend driven Node.js application complete with pages and content, backend logic and a PostgreSQL database for data storage.

## Prerequisites

The only prerequisite software required to have installed at this point is Git for version control and a code editor - we will use VS Code ().

## Package Management

The foundation of the project development software is Node. While functional, Node depends on "packages" to add functionality to accomplish common tasks. This requires a package manager. Three common managers are NPM (Node Package Manager), YARN, and PNPM. While all do the same thing, they do it slightly differently. We will use PNPM for two reasons: 1) All packages are stored on your computer only once and then symlinks (system links) are created from the package to the project as needed, 2) performance is increased meaning that when the project builds, it does so faster.
You will need to either install or activate PNPM before using it. See https://pnpm.io/

## Install the Project Dependencies

1. Open the downloaded project folder (where this file is located) in VS Code (VSC).
2. Open the VSC terminal: Terminal > New Window.
3. Run the following command in the terminal:

   pnpm install

4. The first time it may take a few minutes, depending on the speed of your computer and the speed of your Internet connection. This command will instruct PNPM to read the package.json file and download and install the dependencies (packages) needed for the project. It will build a "node_modules" folder storing each dependency and its dependencies. It should also create a pnpm-lock.yaml file. This file should NEVER be altered by you. It is an internal file (think of it as an inventory) that PNPM uses to keep track of everything in the project.

## Start the Express Server

With the packages installed you're ready to run the initial test.

1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.
2. Type the following command, then press Enter:

   pnpm run dev

3. If the command works, you should see the message "app listening on localhost:5500" in the console.
4. Open the package.json file.
5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.
7. Open the server.js file.
8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.
9. These variables are used when the server starts on your local machine.

## Move the demo file

When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.

1. Find and move that simple web page to the public folder. Be sure to note its name.

## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.

CSE 340 Project Continuity Guide
Project Overview

Course: CSE 340 (Web Backend Development)
Student: Tayler Hickman
Project: CSE Motors (car dealership web app)
Directory: C:\Users\Hickb\OneDrive\cse_340_starter_file\340-starter
Technologies: Node.js, Express, EJS, PostgreSQL, Render.com
Render URL: https://cse340-app-al4m.onrender.com
GitHub: https://github.com/tsue-hickman/340-starter
Database: PostgreSQL (host: 143.198.247.195, port: 5432, user: hickman76907, db: hickman76907)

Current Status (July 16, 2025)

Progress: Installed PostgreSQL 17.5, fixed psql PATH, fixed SSL/SASL errors, applied schema.sql to create classification and inventory tables, set PNPM_HOME to fix pnpm global bin directory for Assignment 1.
Fixes Applied:
Installed PostgreSQL (C:\Program Files\PostgreSQL\17\bin), added to PATH.
Fixed database/index.js (ssl: { rejectUnauthorized: false, sslmode: "require"}), removed cse340 dependency.
Applied schema.sql to create classification table with rows (Sport, SUV, Sedan, Truck).
Set PNPM_HOME=C:\Users\Hickb\AppData\Local\pnpm and added to PATH.

Issues Resolved: psql not found, password authentication, SSL errors, SASL errors, dependency issues, missing classification table.
Pending: Update pnpm to v10.13.1 (stuck at v10.7.0 due to ERR_PNPM_GLOBAL_PNPM_INSTALL).

File Structure
340-starter/
├── .env
├── .gitignore
├── package.json
├── server.js
├── controllers/
│ ├── accountController.js
│ ├── baseController.js
│ └── invController.js
├── database/
│ ├── index.js
│ ├── schema.sql
│ ├── assignment2.sql
│ └── rebuild.sql
├── models/
│ ├── account-model.js
│ └── inventory-model.js
├── node_modules/
│ ├── bin/
│ ├── pnpm/
│ ├── connect-flash/
│ ├── css340/
│ ├── dotenv/
│ ├── ejs/
│ ├── express/
│ ├── express-ejs-layouts/
│ ├── express-session/
│ ├── express-validator/
│ ├── nodemon/
│ └── ...
├── public/
│ ├── css/
│ │ └── styles.css
│ └── images/
│ ├── site/
│ │ ├── favicon-32x32.png
│ │ ├── home.jpg
│ │ ├── icon.png
│ │ ├── own_today.png
│ │ ├── small_check.jpg
│ │ └── small_check.png
│ ├── upgrades/
│ │ ├── bumper-stickers.png
│ │ ├── flame-decals.png
│ │ ├── flux-cap.png
│ │ └── hub-caps.png
│ └── vehicles/
│ ├── adventador.jpg
│ ├── adventador-tn.jpg
│ ├── aerocar.jpg
│ ├── aerocar-tn.jpg
│ ├── batmobile.jpg
│ ├── batmobile-tn.jpg
│ ├── camaro.jpg
│ ├── camaro-tn.jpg
│ ├── crwn-vic.jpg
│ ├── crwn-vic-tn.jpg
│ ├── delorean.jpg
│ ├── delorean-tn.jpg
│ ├── dog-car.jpg
│ ├── dog-car-tn.jpg
│ ├── escalade.jpg
│ ├── escalade-tn.jpg
│ ├── fire-truck.jpg
│ ├── fire-truck-tn.jpg
│ ├── hummer.jpg
│ ├── hummer-tn.jpg
│ ├── mechanic.jpg
│ ├── mechanic-tn.jpg
│ ├── model-t.jpg
│ ├── model-t-tn.jpg
│ ├── monster-truck.jpg
│ ├── monster-truck-tn.jpg
│ ├── mystery-van.jpg
│ ├── mystery-van-tn.jpg
│ ├── no-image.jpg
│ ├── no-image-tn.jpg
│ ├── survan.jpg
│ ├── survan-tn.jpg
│ ├── wrangler.jpg
│ └── wrangler-tn.jpg
├── routes/
│ ├── accountRoutes.js
│ ├── inventoryRoutes.js
│ └── static.js
├── utilities/
│ ├── index.js
│ └── inventory-validation.js
├── views/
│ ├── account/
│ │ ├── account-management.ejs
│ │ ├── login.ejs
│ │ ├── register.ejs
│ │ └── update.ejs
│ ├── errors/
│ │ └── error.ejs
│ ├── inventory/
│ │ ├── add-classification.ejs
│ │ ├── add-inventory.ejs
│ │ ├── add-review.ejs
│ │ ├── admin.ejs
│ │ ├── classification.ejs
│ │ ├── delete-inventory.ejs
│ │ ├── detail.ejs
│ │ ├── edit-inventory.ejs
│ │ ├── management.ejs
│ │ └── search.ejs
│ ├── layouts/
│ │ └── layout.ejs
│ ├── partials/
│ │ ├── footer.ejs
│ │ ├── head.ejs
│ │ ├── header.ejs
│ │ ├── navigation.ejs
│ │ └── index.ejs
│ └── index.ejs
└── README.md

Setup Instructions

Install PostgreSQL:

Installed at C:\Program Files\PostgreSQL\17.
Added to PATH: C:\Program Files\PostgreSQL\17\bin.
Verify: psql --version.

Database:

Run in psql:psql -h 143.198.247.195 -p 5432 -U hickman76907 -d hickman76907 -f database/schema.sql

Update .env:DATABASE_URL=postgresql://hickman76907:706376907@143.198.247.195:5432/hickman76907?ssl=true
NODE_ENV=development
NODE_VERSION=22.13.0

Set Render.com environment variables: DATABASE_URL, NODE_ENV=production, NODE_VERSION=22.13.0.

Dependencies:
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json -ErrorAction Ignore
pnpm install
pnpm add ejs express express-ejs-layouts pg@latest nodemon

Run Locally:
pnpm run dev
Start-Process "http://localhost:5500"

Deploy:

Commit: git add .; git commit -m "Message"; git push origin main
Manual deploy on Render.com: “Clear build cache & deploy”.

Assignments Completed

Week 2: Node.js/Express app, EJS templates, partials, Render.com deployment.
Assignment 1: Home view with Delorean section, upgrades, reviews (nearly complete, pending local testing and deployment).
Assignment 2: SQL queries and rebuild script (pending).
Assignment 3: Vehicle detail view (pending).
Assignment 4: Inventory management views (pending).
Assignment 5: Account management with JWT (pending).
Enhancement: Vehicle search (pending).

Troubleshooting

pnpm Error: If ERR_PNPM_GLOBAL_PNPM_INSTALL, try npm install -g pnpm@10.13.1 or proceed with v10.7.0.
Database Errors: Verify tables in psql (\dt, SELECT \* FROM classification;).
Connection Issues: Ensure ssl: { rejectUnauthorized: false, sslmode: "require"} in database/index.js, use DATABASE_URL in .env.
Deployment Issues: Check package.json for express-ejs-layouts and pg@latest, use 0.0.0.0 and process.env.PORT in server.js.
Windows Commands: Use Start-Process, pnpm run dev.

Next Steps

Update pnpm to v10.13.1, test locally, deploy, and submit Assignment 1 by July 16.
Complete Assignment 2 by July 17.
Share Weeks 2–5 instructions.
Test locally (http://localhost:5500) and on Render.com (https://cse340-app-al4m.onrender.com).

Contact

GitHub: https://github.com/tsue-hickman/340-starter
Render Dashboard: https://dashboard.render.com/
Database Backup: http://143.198.247.195/manage/index.php

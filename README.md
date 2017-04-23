# BaseNodeTs

## Introduction
Basic nodejs project in typescript for single page applications.
This project uses [gulp](http://http://gulpjs.com) to manage tasks and [bower](https://bower.io) to manage client packages.

## Installation
 * Ensure [node js](https://nodejs.org) and [npm](https://www.npmjs.com/) are installed.
 * Fork or download the souce code
 * Install globally the following packages:
    ```
    npm install -g gulp-cli
    npm install -g typescript
    npm install -g typings
    npm install -g bower
    ```
 * Complete the installation with the following commands:
    ```
    npm install
    typings install
    bower install
    ```
## Structure
* **dist** Compiled and/or distributable files
* **src**
	* **client** your client source code
		* ***bower_components*** Default bower destination folder
		* **css** your custom style file. All css files
	* **server** your server source code
	* **shared** shared source code between client and server
	* **tests** test source code

## Commands

The following gulp comma

* **client:dev:build**
	Generate in *dist/public* folder client development files
* **server:dev:build**
	Generate in *dist/server* folder server development files
* **dev:build**
	Generate in *dist* folder both server and client development files
* **test**
	Execute all tests
* **client:prod:build --build_version *version***
	Generate in *dist/public* folder distributable files. *version* value must be provided
* **server:prod:build --build_version *version***
	Generate in *dist/server* folder client and server distributable files. *version* value must be provided
* **prod:build --build_version *version***
	Generate in *dist* folder client and server distributable files. *version* value must be provided


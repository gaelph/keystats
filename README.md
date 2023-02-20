# Keystats

Keystats gathers and display statistics on your typing, if you
have a compatible QMK enabled Keyboard (via raw HID messaging).

**NOTE: This development version only supports the Plaid for now**

## Prerequisites

You must have a Plaid keyboard. Any QMK enabled keyboard should
work with minor modifications.

## Installation

After cloning the repository, run:
```sh
npm install && cd client && npm install && cd ..
```
To install all the dependencies.

## Usage

### Gather data
```sh
npm run start
```
starts the program that communicates with the keyboard.

There is currently no way to daemonize it, but you can start it in the background
with
```sh
nohup npm run start &
disown $1
```

### Display the data
```
npm run start:server
```
starts a server and gives you an URL you can access with your browser.

By default it listens to port 5000 by you can change it by starting
your server with
```
PORT=60138 npm run start:server
```



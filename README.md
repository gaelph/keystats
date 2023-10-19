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
npm install;&& cd src/client && npm install && cd ../..;
```
To install all the dependencies.
Make sure you have a configuration file in `~/.config/keystats/keystats.json`
with contents such as:
```json
{
	"devices": [
		{
			"name": "Plaid",
			"vendorId": 5824,
			"productId": 10203,
			"usagePage": "0xff60",
			"usage": "0x61",
			"fingerMap": [
				[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
				[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
				[0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9],
				[0, 0, 1, 2, 4, 4, 5, 5, 7, 8, 9, 9]
			]
		}
	]
}
```
Then :
```sh
npm run build;
./bin/install_service
./bin/load_service
```

## Usage

Plug your keystats enabled QMK keyboard and  open your browser at
[http://localhost:12000](http://localhost:12000)

## Change the server port
Start by stopping the services if they are running:
```sh
./bin/unload_service
```

Then change the port number in `res/com.gaelph.keystats-server.plist`, line 16
to something that suits you better.
Reinstall the services:
```sh
./bin/install_service
```
And start the services again:
```sh
./bin/load_service
```

## Configuration
Then configration file has the following format:
```typescript
interface Config {
	devices: {
		name: string;
		productId: number;
		vendorId: number;
		usagePage: string; // 0x starting hexadecimal value
		usage: string; // 0x starting hexadecimal value
		fingerMap: nubmer[][] // Matrix of number from 0 to 9
	}[];
}
```

### Finger Map
The finger map is a matrix used to indentify which finger you use to type
which key. So the matrix must have the same shape as the matrix used in your
QMK firmware.

The fingers are numbered from 0 to 9, where 0 is the left pinkie, 4 is the
left thumb, 5 is the right thumb, and 9 ist the right pinkie

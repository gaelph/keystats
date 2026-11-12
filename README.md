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
npm install && cd src/client && npm install && cd ../..;
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

## Updating

After pulling a new version of the project, run:
```sh
npm run build;
bin/reload_service;
```

## Uninstalling
Run:
```sh
# Stop and remove the launch agents
bin/unload_service;
bin/uninstall_service;
# Remove the database
rm -rf $HOME/.local/state/keystats
# Remove the configuration
rm -rf $HOME/.config/keystats
# Remove the logs
rm -rf $HOME/.cache/keystats
```


## Usage

Plug your keystats enabled QMK keyboard and  open your browser at
[http://localhost:12000](http://localhost:12000)

### Layout comparison

Open **Layout comparison** to project the selected keyboard's All Time/day data
onto **one selected target** beside the actual 4×12 recording keyboard. The
**Compare with** dropdown offers QWERTY, AZERTY, Colemak-DH, Bépo and ISRT.
AZERTY is the default; the browser remembers the target across reloads and
recording keyboards. The initial observed page is unchanged.

The targets are macOS US ANSI, macOS French ISO, Colemak-DH ISO ABC Extended with
Angle fingering, plain macOS Bépo 1.1rc2 ISO, and original 2021-01-27 ISRT ANSI.
ISRT provides verified base/Shift outputs only—no guessed Option layer. Pinned
sources and data-license attribution are documented in the
[profile provenance](src/common/src/projection/profiles/README.md).

In comparison, only first-layer legends are shown on the observed keyboard;
recorded presses from **all layers are summed at each physical row/column** into
one heatmap. The initial observed page retains its separate layer heatmaps. Both panels use
the original blue–green–yellow–red `heatmap.js` rendering, not a separate flat-fill
color scheme. Source input is
assumed to be macOS French. The view loads one aggregate response on demand and
uses the existing Refresh button. Both comparison heatmaps use the same
linear/log normalization, common source reference total and maximum count across
the **entire available catalogue**, including hidden targets. Switching the target
keeps the source's colors stable. Equal counts have equal intensity before neighboring hotspots
blend; zero-count positions are not painted. Changing the scale makes no request.
The legacy normalization remains only on the standalone observed page.

Counts are **estimated key participation**, not measured alternative keypresses:
modifiers participate per action, and confirmed literal circumflex/backtick/tilde
aliases can add a dead-key-plus-Space recipe. Coverage, unknown actions and
unplaceable modifier sides remain visible. Existing observed statistics are
unchanged. See [the specification](docs/specifications/layout-projection.md).

Verified French-letter composition is supported across targets, bounded to one
dead key plus one completing key and the agreed French character set/uppercase.
Recipes match exact codepoints, never merely canonically equivalent strings.
Routes minimize total counted uses; composition is never substituted for Cmd/Ctrl
shortcuts. QWERTY coverage/counts can therefore differ from the earlier release.
Source dead-key history is still not reconstructed.

Both layouts show aligned row, hand and finger usage sections. The 4×12 uses
all recorded presses and the keyboard's configured hand/finger assignments; each
projected layout uses its estimated key uses and standard touch-typing assignments. Percentages
include generated modifier participation; unplaced uses stay in the denominator.
Space uses the left thumb; Command/Option use thumbs; Control/Fn use the left
pinkie. Function/media keys and arrows have no fixed finger assignment. Historical
same-hand/same-finger repetitions cannot be projected because event order is not
stored. The recording keyboard's physical rows remain top/home/bottom/thumb,
independent of layer legends; missing assignments are explicitly unassigned.
There is no separate modifier-usage breakdown. One response supplies both visible
panels and all cached target results. They share aligned grid rows on desktop and
stack observed-first on narrow screens. Target/scale/activity switching makes no
history request. Unverified/failed profiles are disabled with reasons; failures
do not prevent using the observed keyboard or other valid targets.

Use **All presses / Printing only** to filter both heatmaps and statistics
together. All presses is the default and preserves the recorded 4×12 counts.
Printing only keeps identifiable text actions (including Space and confirmed
glyph aliases), excludes navigation/editing, Enter/Tab, Cmd/Ctrl shortcuts,
standalone modifiers and unresolved actions, and retains the Shift/Option needed
for text entry. Application-specific interpretation cannot be inferred.

The 4×12's printing-only total combines recorded printing actions with **estimated
Shift/Option participation per action**, not historical modifier holds. Only unique
side-specific source modifier positions are drawn; ambiguous/missing positions
remain unplaced and in the statistics denominator. Target projections retain
their existing modifier and dead-key recipe rules. Both modes come from the same
aggregate response; switching modes makes no request and does not change the
initial observed page, capture, or stored data.

### Trends

The **Trends** tab charts volume, selected character actions and physical row,
hand or finger workload over a chosen date range. Choose a preset or custom dates
and automatic, daily, Monday-based weekly or monthly grouping. Chart and range
preferences are remembered in the browser. Hover the charts or use the bucket
inspector for values and recording-day coverage. Use **Refresh** to load a new
snapshot; data does not update automatically. Finger workload uses stacked areas;
the selected categories retain their shares of all uses rather than being
renormalized when other fingers are hidden.

Days without records are gaps, not confirmed zeroes. Longer buckets show totals
for recorded days only, with coverage rather than an estimate for missing days.
The character/key picker includes decoded named keys such as Backspace, Enter and
arrows, as well as characters. Shares use all decoded characters and named keys
as their denominator, including Space and shortcuts; they are not a record of
text actually entered. Named key counts combine modifier combinations. Printing volume excludes shortcuts and modifiers; printing
physical workload includes estimated Shift/Option participation. Historic
character interpretation assumes macOS French input and current keyboard and
finger assignments; changes in historical configuration cannot be reconstructed.

### Verification

```sh
npm test
npm run typecheck
```

Tests use in-memory SQLite and synthetic fixtures, not your live database.
The offline profile-importer test uses Python 3's standard library; no package
installation or live input-source activation is needed.
Static layout definitions are captured with a development-only macOS probe;
see [profile provenance and regeneration](src/common/src/projection/profiles/README.md).

After building, `npm run test:browser` runs an isolated headless Chrome smoke test
with synthetic intercepted API responses, never live keyboard capture. It needs
Node 22+ and Chrome (`CHROME_BIN` can override its executable path).

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

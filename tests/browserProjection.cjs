// Optional real-browser smoke test, no npm browser dependency or live capture.
// Requires Node 22+ (WebSocket) and Chrome; CHROME_BIN can override its location.
/* global WebSocket */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const http = require("node:http");
const { spawn } = require("node:child_process");

async function main() {
  assert.equal(typeof WebSocket, "function", "Browser smoke test requires Node 22+");
  const root = path.resolve(process.env.KEYSTATS_TEST_CLIENT_ROOT || "build/client");
  assert.ok(fs.existsSync(path.join(root, "index.html")), "Run npm run build first");
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;
    const file = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, content) => {
      if (error) { res.writeHead(404).end(); return; }
      res.setHeader("Content-Type", file.endsWith(".js") ? "application/javascript" : file.endsWith(".css") ? "text/css" : file.endsWith(".html") ? "text/html" : "application/octet-stream");
      res.end(content);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const temporary = process.env.KEYSTATS_TEST_TMP || path.join(os.tmpdir(), "opencode");
  fs.mkdirSync(temporary, { recursive: true });
  const profile = fs.mkdtempSync(path.join(temporary, "keystats-browser-"));
  const chrome = spawn(process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions",
    "--disable-background-networking", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--window-size=1600,1200", "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  const exited = new Promise((resolve) => { chrome.once("exit", resolve); chrome.once("error", resolve); });
  let socket;
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let log = "";
      chrome.stderr.on("data", (chunk) => {
        log += chunk;
        const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) resolve(match[1]);
      });
      chrome.once("error", reject);
      chrome.once("exit", (code) => reject(new Error(`Chrome exited before initialization: ${code}\n${log}`)));
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
    let sequence = 0, session, projectionRequests = 0, trendRequests = 0, failNext = false, failTrend = false, holdKeymaps = true, activityFixture = "base";
    const pending = new Map(), heldKeymaps = [], exceptions = [];
    const send = (method, params = {}, sessionId = session) => new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP command timed out: ${method}`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
    const groups = [
      { keycode: "14", count: 100, modifiers: 0, type: "plain" },
      { keycode: "7e4f", count: 10, modifiers: 0, type: "plain" },
      { keycode: "2c", count: 5, modifiers: 0, type: "plain" },
      { keycode: "e1", count: 10, modifiers: 0, type: "mtap" },
    ];
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const outputs = require("../src/common/src/projection/profiles/generated-layouts.json").french.outputs;
    const codes = [
      [41, 0x7e4f, 31, 32, 33, 34, 35, 36, 37, 38, 39, 42],
      [43, 20, 26, 8, 21, 23, 28, 24, 12, 18, 19, 40],
      [225, 4, 22, 7, 9, 10, 11, 13, 14, 15, 51, 229],
      [224, 227, 226, 44, 44, 44, 44, 230, 231, 80, 81, 79],
    ];
    const labels = { 41: "ESC", 42: "BKSP", 43: "TAB", 40: "ENTER", 44: "SPACE", 225: "SHIFT", 229: "SHIFT",
      224: "CTRL", 227: "CMD", 231: "CMD", 226: "ALT", 230: "ALT", 80: "LEFT", 81: "DOWN", 79: "RIGHT", [0x7e4f]: "^" };
    const keymapBody = { keymaps: [codes.map((row) => row.map((usage) => [{
      keycode: usage.toString(16), type: "plain",
      character: labels[usage] || outputs.find((output) => output.usage === usage && output.modifiers === 0)?.glyph || "",
    }]))] };
    const otherLayer = JSON.parse(JSON.stringify(keymapBody.keymaps[0]));
    otherLayer[1][1][0].character = "OTHER-LAYER";
    keymapBody.keymaps.push([], otherLayer);
    const matrix = Array.from({ length: 4 }, () => Array(12).fill(0));
    matrix[1][1] = 40; matrix[0][1] = 10; matrix[2][0] = 10; matrix[3][5] = 5;
    const laterMatrix = Array.from({ length: 4 }, () => Array(12).fill(0));
    laterMatrix[1][1] = 60;
    const keymapUsage = [matrix, [], laterMatrix];
    const fingerMap = [0, 0, 1, 2, 3, 3, 6, 6, 7, 8, 9, 9];
    const physicalKeys = codes.flatMap((row, r) => row.map((_, column) => {
      const finger = r === 3 ? [0, 0, 1, 2, 4, 4, 5, 5, 7, 8, 9, 9][column] : fingerMap[column];
      return { row: r, column, finger, hand: finger < 5 ? 0 : 1 };
    }));
    const observed = { ...keymapBody, keymapUsage, physicalKeys, totalKeypresses: 125 };
    const engine = await require("./loadTs.cjs")("src/common/src/projection/index.ts");
    const { makeTrends } = await require("./loadTs.cjs")("src/service/trends.ts");
    const basePositions = [
      { ...groups[0], count: 40, layer: 0, row: 1, column: 1 }, { ...groups[0], count: 60, layer: 2, row: 1, column: 1 },
      { ...groups[1], layer: 0, row: 0, column: 1 }, { ...groups[2], layer: 0, row: 3, column: 5 },
      { ...groups[3], layer: 0, row: 2, column: 0 },
    ];
    const sourceFrom = (positions) => {
      const matrix = Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => Array(12).fill(0)));
      for (const item of positions) matrix[item.layer][item.row][item.column] += item.count;
      const total = positions.reduce((sum, item) => sum + item.count, 0);
      const source = { keyboardId: 343, date: null, sourceEventCount: total,
        groups: positions.map(({ keycode, modifiers, type, count }) => ({ keycode, modifiers, type, count })),
        observed: { ...observed, keymapUsage: matrix, totalKeypresses: total } };
      return { ...source, printing: engine.printingOnly(source, positions, engine.frenchProfile) };
    };
    const sources = {
      base: sourceFrom(basePositions),
      mixed: sourceFrom([...basePositions,
        { keycode: "50", count: 7, modifiers: 0, type: "plain", layer: 0, row: 3, column: 9 },
        { keycode: "14", count: 3, modifiers: 8, type: "plain", layer: 0, row: 1, column: 1 },
        { keycode: "1e", count: 4, modifiers: 2, type: "plain", layer: 0, row: 0, column: 4 },
        { keycode: "2d", count: 2, modifiers: 0x40, type: "plain", layer: 0, row: 0, column: 5 },
      ]),
      empty: sourceFrom([{ keycode: "2a", count: 5, modifiers: 0, type: "plain", layer: 0, row: 1, column: 11 }]),
      sourceDominant: sourceFrom([...basePositions,
        { keycode: "16", count: 80, modifiers: 0, type: "plain", layer: 2, row: 1, column: 1 },
      ]),
      hiddenDominant: sourceFrom([
        { keycode: "7e4f", count: 10, modifiers: 0, type: "plain", layer: 0, row: 0, column: 1 },
        { keycode: "2c", count: 10, modifiers: 0, type: "plain", layer: 0, row: 3, column: 5 },
      ]),
    };
    for (const [name, keycode] of [["targetFailure", "1e"], ["allTargetsFail", "14"]]) {
      const data = sourceFrom([{ keycode, count: 5000000000000000, modifiers: 2, type: "plain", layer: 0, row: 1, column: 1 }]);
      delete data.printing; // This synthetic numeric-edge test exercises All presses, not an overflowing inferred source total.
      sources[name] = data;
    }
    const fulfill = (requestId, body, responseCode, sessionId) => send("Fetch.fulfillRequest", {
      requestId, responseCode, responseHeaders: [
        { name: "Content-Type", value: "application/json" }, { name: "Access-Control-Allow-Origin", value: "*" },
      ], body: Buffer.from(JSON.stringify(body)).toString("base64"),
    }, sessionId);
    socket.addEventListener("message", async (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const task = pending.get(message.id);
        if (task) { clearTimeout(task.timer); pending.delete(message.id); message.error ? task.reject(new Error(JSON.stringify(message.error))) : task.resolve(message.result); }
        return;
      }
      if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails);
      if (message.method !== "Fetch.requestPaused") return;
      try {
        const { requestId, request } = message.params;
        const url = new URL(request.url);
        let body, code = 200;
        if (url.pathname.endsWith("/trends")) {
          trendRequests++;
          if (failTrend) { failTrend = false; code = 500; body = { error: "Synthetic failure" }; }
          else {
            const end = url.searchParams.get("end"), start = url.searchParams.get("start") || today;
            const grouping = url.searchParams.get("grouping") === "auto" ? "daily" : url.searchParams.get("grouping");
            const days = [4, 3, 1, 0].map((offset) => new Date(Date.parse(`${end}T00:00:00Z`) - offset * 86400000).toISOString().slice(0, 10)).filter((date) => date >= start);
            const history = [...basePositions, { keycode: "2a", count: 5, modifiers: 0, type: "plain", layer: 0, row: 1, column: 11 }];
            const positions = days.flatMap((date) => history.map((item) => ({ ...item, date })));
            body = makeTrends(343, start, end, grouping, positions, history, observed, today);
          }
        } else if (url.pathname.endsWith("/projection-source")) {
          projectionRequests++;
          if (failNext) { failNext = false; code = 500; body = { error: "Synthetic failure" }; }
          else body = { ...sources[activityFixture], date: url.searchParams.get("date") };
        } else if (url.pathname.endsWith("/available-dates")) body = { dates: [new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12).toISOString()] };
        else if (url.pathname.endsWith("/keymaps")) {
          if (holdKeymaps) { heldKeymaps.push({ requestId, sessionId: message.sessionId }); return; }
          body = keymapBody;
        } else if (url.pathname.endsWith("/characterCounts")) body = { records: [], totalCharacters: 0 };
        else if (url.pathname.endsWith("/handAndFingerUsage")) body = { handRepetitions: [[], []], fingerRepetitions: Array.from({ length: 10 }, () => []) };
        else if (url.pathname.endsWith("/totalCounts")) body = {
          keymapUsage, layerUsage: { 0: 65, 2: 60 }, rowUsage: { 0: 10, 1: 100, 2: 10, 3: 5 }, handUsage: { 0: 125, 1: 0 },
          fingerUsage: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i, i === 0 ? 120 : i === 4 ? 5 : 0])), totalKeypresses: 125,
        };
        else body = { keyboards: [{ id: 343, name: "Synthetic keyboard" }] };
        await fulfill(requestId, body, code, message.sessionId);
      } catch (error) { exceptions.push({ interceptionError: error.message }); }
    });
    const { targetId } = await send("Target.createTarget", { url: "about:blank" }, null);
    ({ sessionId: session } = await send("Target.attachToTarget", { targetId, flatten: true }, null));
    await send("Page.enable"); await send("Runtime.enable");
    await send("Fetch.enable", { patterns: [{ urlPattern: "*://*/api/*" }] });
    const evaluate = async (expression) => {
      const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const waitFor = (condition) => evaluate(`new Promise((resolve,reject)=>{const check=()=>{if(${condition}){observer.disconnect();clearTimeout(timer);resolve(true)}};const observer=new MutationObserver(check);const timer=setTimeout(()=>{observer.disconnect();reject(new Error('DOM condition timed out: '+${JSON.stringify(condition)}))},8000);observer.observe(document,{subtree:true,childList:true,attributes:true});check()})`);
    const panels = "document.querySelectorAll('.projection-panels > section').length === 2";
    const painted = "document.querySelectorAll('.projection-heatmap-image').length === 1 && document.querySelector('.projection-observed canvas')?.width > 0";
    const idle = "document.querySelector('header button[aria-busy=\"false\"]')";
    const refresh = () => evaluate("[...document.querySelectorAll('header button')].find(b=>b.textContent==='Refresh').click()");
    const chooseActivity = (label) => evaluate(`[...document.querySelectorAll('.projection-activity-controls button')].find(b=>b.textContent===${JSON.stringify(label)}).click()`);
    const chooseTarget = async (id) => {
      await evaluate(`document.querySelector('#comparison-target').focus(); document.querySelector('#comparison-target').value=${JSON.stringify(id)};
        document.querySelector('#comparison-target').dispatchEvent(new Event('change',{bubbles:true}))`);
      const label = engine.targetRegistry.find(entry => entry.id === id).label;
      await waitFor(`document.querySelector('.projection-panels > section:nth-child(2) > .projection-panel-heading h3')?.textContent===${JSON.stringify(label)}`);
      await waitFor(painted);
    };
    const readUsageTables = () => evaluate(`Array.from(document.querySelectorAll('.projection-usage')).map(panel =>
      Object.fromEntries(Array.from(panel.querySelectorAll('[role="table"]')).map(table => [table.getAttribute('aria-label'),
        Object.fromEntries(Array.from(table.querySelectorAll('[role="row"]')).map(row => [
          row.querySelector('[role="cell"]').textContent, { count: row.querySelector('meter').value,
            total: row.querySelector('meter').max, percentage: row.lastElementChild.textContent }
        ]))]))
    )`);
    const checkAlignment = async () => {
      const positions = await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(
        ['.projection-panel-heading', '.projection-panel-heading > p:last-child', '.projection-usage-intro',
          ...['rows', 'hands', 'fingers'].flatMap(kind => ['[data-usage="'+kind+'"]',
            ...Array.from({length: kind === 'rows' ? 8 : kind === 'hands' ? 3 : 11}, (_, i) => '[data-usage="'+kind+'"] [role="row"]:nth-child('+(i+1)+')')])
        ].map(selector => ({
          selector, tops: [...document.querySelectorAll('.projection-panels > section')].map(panel => panel.querySelector(selector).getBoundingClientRect().top)
        }))
      ))))`);
      for (const { selector, tops } of positions) {
        assert.ok(Math.max(...tops) - Math.min(...tops) <= 1, `${selector} must align across both layouts: ${JSON.stringify(tops)}`);
      }
    };
    const checkSharedColors = async () => {
      const id = await evaluate("document.querySelector('#comparison-target').value");
      const profile = engine.targetRegistry.find(entry => entry.id === id).profile;
      const result = engine.project(sources.base, engine.frenchProfile, profile);
      const busy = profile.keys.filter(key => result.keyUses[key.id] > 0).map(key => ({
        x: Math.round((key.x + key.width / 2) * 60), y: Math.round((key.y + key.height / 2) * 60), count: result.keyUses[key.id],
      }));
      const centers = [busy.find(point => point.count === 100), busy.find(point => point.count === 10 &&
        busy.every(other => other === point || Math.hypot(point.x - other.x, point.y - other.y) > 61))];
      assert.ok(centers.every(Boolean), `Fixture needs isolated 100/10 keys for ${id}`);
      const colors = await evaluate(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))).then(async () => {
        const sample = (canvas, points) => points.map(({x,y}) => [...canvas.getContext('2d').getImageData(x,y,1,1).data]);
        const source = document.querySelector('.projection-observed canvas');
        const colors = [sample(source, [{x:90,y:90},{x:30,y:150}])];
        const centers = ${JSON.stringify(centers)};
        for (const element of document.querySelectorAll('.projection-heatmap-image')) {
          const image = new Image(); image.src = element.getAttribute('href'); await image.decode();
          const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
          canvas.getContext('2d').drawImage(image,0,0); colors.push(sample(canvas, centers));
        }
        return {colors, zeroAlpha: source.getContext('2d').getImageData(690,30,1,1).data[3]};
      })`);
      assert.deepEqual(colors.colors[0], colors.colors[1], `Same isolated 100/10 counts must produce identical source/${id} colors`);
      assert.equal(colors.zeroAlpha, 0, "Zero-count source coordinates must not paint phantom activity");
    };
    await send("Page.navigate", { url: `http://127.0.0.1:${server.address().port}/` });
    await waitFor("document.querySelector('#comparison-tab') && document.body.innerText.includes('Synthetic keyboard')");
    assert.equal(projectionRequests, 0, "Observed view must not load projection data");
    await evaluate("document.querySelector('#comparison-tab').click()");
    await waitFor(panels);
    await waitFor(painted);
    const imagePixels = await evaluate(`Promise.all([...document.querySelectorAll('.projection-heatmap-image')].map(async element => {
      const image = new Image(); image.src = element.getAttribute('href'); await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let painted = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) painted++;
      return {painted, width: canvas.width, height: canvas.height, display: getComputedStyle(element).display,
        clip: element.getAttribute('clip-path'), bounds: element.getBoundingClientRect().toJSON()};
    }))`);
    assert.ok(imagePixels.every((image) => image.painted > 0 && image.display !== "none" && !image.clip && image.bounds.width > 0),
      `Projected renderer must paint visible activity without an empty SVG clip: ${JSON.stringify(imagePixels)}`);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.projection-key rect')).fill"), "none",
      "Flat key fills must not cover the shared heatmap rendering");
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('.projection-keyboard')).every(svg => {
      const frame = svg.parentElement.getBoundingClientRect(), bounds = svg.getBoundingClientRect();
      return bounds.right <= frame.right + 1 && bounds.left >= frame.left - 1 && bounds.width >= frame.width * 0.9 && bounds.height > 100;
    })`), "Projected keyboards must fill their desktop panel without clipping or shrinking to icon size");
    if (process.env.KEYSTATS_SCREENSHOT_DIR) console.log("Projected image diagnostics:", JSON.stringify(imagePixels));
    assert.match(await evaluate("document.querySelector('.projection-observed').textContent"), /4 × 12 ortholinear · 48 keys/);
    assert.equal(await evaluate("document.querySelectorAll('.projection-observed [title$=\"%\"]').length"), 48);
    assert.equal(await evaluate("document.querySelectorAll('.projection-observed canvas').length"), 1,
      "Many recorded layers must produce exactly one comparison heatmap");
    assert.equal(await evaluate("document.querySelectorAll('.projection-observed [title$=\"%\"]')[13].title"), "80.00%",
      "Comparison heatmap must sum 40 first-layer + 60 later-layer presses at the same coordinate");
    assert.ok(!(await evaluate("document.querySelector('.projection-observed').textContent")).includes("OTHER-LAYER"),
      "Comparison key legends must come only from the first layer");
    const observedPixels = await evaluate("document.querySelector('.projection-observed canvas').toDataURL()");
    assert.equal(projectionRequests, 1, "StrictMode must deduplicate projection requests");
    const usageTables = await readUsageTables();
    assert.equal(usageTables.length, 2, "Exactly the actual layout and one selected target must expose distributions");
    assert.deepEqual(usageTables[0]["Row usage"]["Home row:"], { count: 100, total: 125, percentage: "80.00%" });
    assert.deepEqual(usageTables[1]["Row usage"]["Home row:"], { count: 0, total: 125, percentage: "0.00%" });
    assert.equal(usageTables[0]["Finger usage"]["Left pinkie:"].count, 120);
    assert.equal(usageTables[0]["Finger usage"]["Left thumb:"].count, 5);
    assert.equal(usageTables[1]["Finger usage"]["Left pinkie:"].count, 100);
    for (const [i, tables] of usageTables.entries()) {
      assert.equal(Object.keys(tables).length, 3);
      assert.equal(tables["Hand usage"]["Left:"].count, i === 0 ? 125 : 115);
      for (const rows of Object.values(tables)) assert.equal(Object.values(rows).reduce((sum, row) => sum + row.count, 0), 125);
    }
    await checkAlignment();
    await checkSharedColors();
    assert.equal(await evaluate("document.querySelector('#comparison-target').value"), "azerty", "Default target is AZERTY, not the first menu entry");
    assert.deepEqual(await evaluate("[...document.querySelector('#comparison-target').options].map(option=>option.textContent)"),
      ["QWERTY", "AZERTY", "Colemak-DH", "Bépo", "ISRT"]);
    for (const entry of engine.targetRegistry) {
      await chooseTarget(entry.id);
      const tables = await readUsageTables();
      assert.deepEqual(tables[0], usageTables[0], "Target selection cannot change recorded usage");
      assert.equal(await evaluate("document.querySelector('.projection-observed canvas').toDataURL()"), observedPixels,
        "Catalogue normalization must keep source pixels stable across target selection");
      const result = engine.project(sources.base, engine.frenchProfile, entry.profile);
      assert.equal(Object.values(tables[1]["Finger usage"]).reduce((sum, row) => sum + row.count, 0), result.estimatedUseCount);
      assert.equal(await evaluate("document.activeElement.id"), "comparison-target", "Selection must not move focus");
      assert.match(await evaluate("document.querySelector('.projection-key-detail').textContent"), /Focus or tap/);
      await checkAlignment(); await checkSharedColors();
    }
    await chooseTarget("azerty");
    assert.equal(projectionRequests, 1, "Five target switches must reuse the source snapshot");
    assert.equal(await evaluate("document.querySelector('.layout-comparison').textContent.includes('Modifier families')"), false,
      "Modifier-family usage breakdown must be removed");
    holdKeymaps = false;
    await Promise.all(heldKeymaps.map(({ requestId, sessionId }) => fulfill(requestId, keymapBody, 200, sessionId)));
    await waitFor(idle);
    await evaluate("document.querySelector('#comparison-tab').focus()");
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowLeft", code: "ArrowLeft", windowsVirtualKeyCode: 37 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowLeft", code: "ArrowLeft", windowsVirtualKeyCode: 37 });
    await waitFor("document.querySelector('#observed-panel canvas')?.width > 0 && document.querySelector('#observed-panel canvas').getBoundingClientRect().width > 0");
    assert.notEqual(await evaluate("document.querySelector('#observed-panel canvas').toDataURL()"), observedPixels,
      "Combined comparison activity must differ from the original, still-layer-specific initial view");
    assert.equal(await evaluate("document.querySelectorAll('#observed-panel [title$=\"%\"]')[13].title"), "32.00%",
      "Initial observed view must retain its original first-layer count, not combined counts");
    assert.equal(await evaluate("document.activeElement.id"), "observed-tab", "Tab keyboard navigation must move focus");
    await evaluate("document.querySelector('#comparison-tab').click()");
    await waitFor(panels);
    assert.equal(projectionRequests, 1, "View reopening must reuse cached data");
    await evaluate("[...document.querySelectorAll('.projection-controls button')].find(b=>b.textContent==='Linear').click()");
    await waitFor("document.querySelector('.projection-legend small').textContent.includes('Linear')");
    await checkSharedColors();
    const linearObservedPixels = await evaluate("document.querySelector('.projection-observed canvas').toDataURL()");
    await evaluate("[...document.querySelectorAll('.projection-controls button')].find(b=>b.textContent==='Logarithmic').click()");
    await waitFor("document.querySelector('.projection-legend small').textContent.includes('Logarithmic')");
    await checkSharedColors();
    assert.notEqual(await evaluate("document.querySelector('.projection-observed canvas').toDataURL()"), linearObservedPixels,
      "The common linear/log control must update the actual 4×12 heatmap too");
    assert.equal(projectionRequests, 1, "Scale toggle must not fetch");
    assert.equal(await evaluate("document.querySelectorAll('.projection-usage [role=table]').length"), 6,
      "Scale changes must preserve all projected usage distributions");
    await evaluate("document.querySelector('.projection-key[aria-label=\"A: 100 estimated uses\"]').focus()");
    await waitFor("document.querySelector('.projection-key-detail strong')?.textContent.includes('100 estimated uses')");
    await evaluate("document.querySelector('.projection-key-detail details').open = true");
    await checkAlignment();
    activityFixture = "mixed";
    await refresh(); await waitFor(`${panels} && ${idle}`);
    assert.equal(projectionRequests, 2, "Manual refresh must fetch once");
    assert.match(await evaluate("document.querySelector('.projection-observed .projection-panel-heading').textContent"), /141 recorded presses/);
    await chooseActivity("Printing only");
    await waitFor("document.querySelector('.projection-filter-summary')?.textContent.includes('121 printing actions retained')");
    assert.equal(projectionRequests, 2, "Activity filtering must reuse the same aggregate response");
    const filtered = await readUsageTables();
    assert.equal(filtered[0]["Row usage"]["Home row:"].count, 100, "Shortcut use at the same coordinate must not leak into printing counts");
    assert.equal(filtered[0]["Row usage"]["Bottom row:"].count, 4, "Source Shift participates per action, not the 10 recorded holds");
    assert.equal(filtered[0]["Finger usage"]["Right thumb:"].count, 2, "Source Option participation must remain counted");
    const totals = [127, 137];
    for (const [i, tables] of filtered.entries()) {
      for (const rows of Object.values(tables)) assert.equal(Object.values(rows).reduce((sum, row) => sum + row.count, 0), totals[i]);
      assert.equal(tables["Row usage"]["Arrow keys:"].count, 0);
    }
    assert.match(await evaluate("document.querySelector('.projection-observed').textContent"), /127 text-entry uses \(estimated modifiers\)/);
    await checkAlignment();
    const printingSourcePixels = await evaluate("document.querySelector('.projection-observed canvas').toDataURL()");
    await chooseTarget("qwerty");
    const qwertyPrinting = await readUsageTables();
    assert.equal(Object.values(qwertyPrinting[1]["Finger usage"]).reduce((sum, row) => sum + row.count, 0), 133);
    assert.equal(await evaluate("document.querySelector('.projection-observed canvas').toDataURL()"), printingSourcePixels);
    await chooseTarget("azerty");
    await evaluate("document.querySelector('#observed-tab').click(); document.querySelector('#comparison-tab').click()");
    await waitFor(panels);
    assert.equal(await evaluate("[...document.querySelectorAll('.projection-activity-controls button')].find(b=>b.textContent==='Printing only').getAttribute('aria-pressed')"), "true");
    await chooseActivity("All presses");
    await waitFor("document.querySelector('.projection-observed .projection-panel-heading').textContent.includes('141 recorded presses')");
    assert.equal((await readUsageTables())[1]["Row usage"]["Arrow keys:"].count, 7);
    await chooseActivity("Printing only");
    assert.equal(projectionRequests, 2, "View/activity toggles must remain local");
    failNext = true;
    await refresh(); await waitFor("document.querySelector('.layout-comparison [role=\"alert\"]')");
    assert.match(await evaluate("document.querySelector('.layout-comparison [role=\"alert\"]').textContent"), /500/);
    await evaluate("[...document.querySelectorAll('.layout-comparison button')].find(b=>b.textContent==='Retry projection').click()");
    await waitFor(panels); assert.equal(projectionRequests, 4);
    // Use the existing date picker, not a test-only application state backdoor.
    await evaluate("document.querySelector('button[aria-label=\"Choose Date\"]').click()");
    const dateLabel = `${String(now.getDate()).padStart(2, "0")} ${now.toLocaleString("en-US", { month: "short" })} ${now.getFullYear()}`;
    await evaluate(`document.querySelector('button[aria-label=${JSON.stringify(dateLabel)}]').click()`);
    await waitFor(`${panels} && document.querySelector('.layout-comparison > p').textContent.includes(${JSON.stringify(today)})`);
    assert.equal(projectionRequests, 5, "Selected day must issue one matching request");
    await waitFor(painted);
    if (process.env.KEYSTATS_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.KEYSTATS_SCREENSHOT_DIR, { recursive: true });
      fs.writeFileSync(path.join(process.env.KEYSTATS_SCREENSHOT_DIR, "projection-desktop.png"),
        Buffer.from((await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false })).data, "base64"));
      await evaluate("document.querySelector('.projection-usage').scrollIntoView()");
      fs.writeFileSync(path.join(process.env.KEYSTATS_SCREENSHOT_DIR, "projection-usage.png"),
        Buffer.from((await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false })).data, "base64"));
      await evaluate("window.scrollTo(0, 0)");
    }
    await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false });
    await checkAlignment();
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    const mobile = await evaluate("({width:innerWidth,documentWidth:document.documentElement.scrollWidth})");
    assert.ok(mobile.documentWidth <= mobile.width + 1, `Mobile overflow: ${JSON.stringify(mobile)}`);
    activityFixture = "empty";
    await refresh();
    await waitFor(`${panels} && ${idle} && document.querySelector('.projection-filter-summary')?.textContent.includes('No identifiable printing actions')`);
    assert.equal(await evaluate("[...document.querySelectorAll('.projection-usage meter')].every(meter=>meter.value===0 && meter.max===1)"), true);
    assert.equal(await evaluate("document.querySelector('.layout-comparison').textContent.includes('NaN')"), false);
    await chooseActivity("All presses");
    await waitFor("document.querySelector('.projection-observed .projection-panel-heading').textContent.includes('5 recorded presses')");
    activityFixture = "sourceDominant";
    await refresh();
    await waitFor(`${panels} && ${idle} && document.querySelector('.projection-legend').textContent.includes('180 presses / uses')`);
    assert.match(await evaluate("document.querySelector('.projection-observed .projection-panel-heading').textContent"), /205 recorded presses/);
    assert.equal(projectionRequests, 7, "Source-inclusive range must derive from the existing refresh response, not a separate request");
    await chooseTarget("qwerty");
    activityFixture = "hiddenDominant";
    await refresh();
    await waitFor(`${panels} && ${idle} && document.querySelector('.projection-legend').textContent.includes('20 presses / uses')`);
    assert.equal(await evaluate("document.querySelectorAll('.projection-observed [title$=\"%\"]')[1].title"), "50.00%");
    assert.equal(await evaluate("document.querySelector('.projection-keyboard').getAttribute('aria-label').includes('QWERTY')"), true);
    // Actual/QWERTY maxima are only 10 here. Hidden French/Bépo commit Space sets the stable maximum of 20.
    await chooseTarget("bepo");
    assert.equal(await evaluate("localStorage.getItem('keystats.comparison.target')"), "bepo");
    await send("Page.reload");
    await waitFor("document.querySelector('#comparison-tab') && document.body.innerText.includes('Synthetic keyboard')");
    assert.equal(await evaluate("document.querySelector('#observed-tab').getAttribute('aria-selected')"), "true", "Remembering target must not change the initial app view");
    await evaluate("document.querySelector('#comparison-tab').click()"); await waitFor(painted);
    assert.equal(await evaluate("document.querySelector('#comparison-target').value"), "bepo", "Target preference must survive browser reload");
    await evaluate("localStorage.setItem('keystats.comparison.target','removed-profile')");
    await send("Page.reload");
    await waitFor("document.querySelector('#comparison-tab') && document.body.innerText.includes('Synthetic keyboard')");
    await evaluate("document.querySelector('#comparison-tab').click()"); await waitFor(painted);
    assert.equal(await evaluate("document.querySelector('#comparison-target').value"), "azerty");
    assert.equal(await evaluate("localStorage.getItem('keystats.comparison.target')"), "azerty");
    activityFixture = "targetFailure";
    await refresh();
    await waitFor(`${panels} && ${idle} && document.querySelector('.projection-panels > section:nth-child(2) [role="alert"]')`);
    assert.equal(await evaluate("document.querySelector('#comparison-target').value"), "azerty", "A failing active target must not change silently");
    assert.equal(await evaluate("document.querySelector('#comparison-target option[value=azerty]').disabled"), true);
    assert.equal(await evaluate("document.querySelector('#comparison-target option[value=qwerty]').disabled"), false);
    assert.equal(await evaluate("document.querySelectorAll('.projection-observed canvas').length"), 1);
    await chooseTarget("qwerty");
    activityFixture = "allTargetsFail";
    await send("Page.reload");
    await waitFor("document.querySelector('#comparison-tab') && document.body.innerText.includes('Synthetic keyboard')");
    await evaluate("document.querySelector('#comparison-tab').click()");
    await waitFor(`${panels} && ${idle} && document.querySelector('#comparison-target')?.value===''`);
    assert.equal(await evaluate("document.querySelectorAll('.projection-heatmap-image').length"), 0);
    assert.equal(await evaluate("document.querySelectorAll('.projection-observed canvas').length"), 1);
    assert.match(await evaluate("document.querySelector('.projection-panels > section:nth-child(2)').textContent"), /No available target/);
    await evaluate("document.querySelector('#trends-tab').click()");
    try { await waitFor("document.querySelectorAll('.trends-chart').length === 3 && document.querySelector('.trends-inspect')"); }
    catch (error) { console.error("Trends diagnostics:", await evaluate("document.body.innerText"), JSON.stringify(exceptions)); throw error; }
    assert.equal(trendRequests, 1, "Trends load must be deduplicated under StrictMode");
    assert.equal(await evaluate("document.querySelectorAll('.trends .recharts-surface').length"), 3);
    assert.equal(await evaluate("document.querySelector('.trends select').value"), "30");
    assert.ok(await evaluate("document.querySelectorAll('.trends-options input:checked').length > 0"));
    const trendBody = await evaluate("document.querySelector('.trends').textContent");
    assert.match(trendBody, /days without records are gaps/i);
    assert.match(trendBody, /Snapshot:/);
    await evaluate("document.querySelector('.trends-picker summary').click()");
    const pickerBefore = await evaluate(`({ chart: document.querySelector('[aria-label="Character and key actions"]').getBoundingClientRect().top,
      labels: [...document.querySelectorAll('.trends-picker-grid label')].map(label=>label.textContent.trim()) })`);
    assert.ok(pickerBefore.labels.includes("Backspace"), "Recorded control keys must be selectable");
    await evaluate("[...document.querySelectorAll('.trends-picker-grid label')].find(label=>label.textContent.trim()==='Backspace').querySelector('input').click()");
    const pickerAfter = await evaluate(`({ chart: document.querySelector('[aria-label="Character and key actions"]').getBoundingClientRect().top,
      labels: [...document.querySelectorAll('.trends-picker-grid label')].map(label=>label.textContent.trim()),
      selected: document.querySelector('.trends-selected-actions').textContent })`);
    assert.deepEqual(pickerAfter.labels, pickerBefore.labels, "Selecting a key must not reorder the picker");
    assert.equal(pickerAfter.chart, pickerBefore.chart, "Selecting a key must not move the chart");
    assert.match(pickerAfter.selected, /Backspace/);
    await evaluate("document.querySelector('.trends-picker summary').click()");
    await evaluate("document.querySelector('#comparison-tab').click(); document.querySelector('#trends-tab').click()");
    await waitFor("document.querySelectorAll('.trends-chart').length === 3");
    assert.equal(trendRequests, 1, "Reopening the same selection must reuse the bounded cache");
    await evaluate("document.querySelector('.trends select').value='7'; document.querySelector('.trends select').dispatchEvent(new Event('change',{bubbles:true}))");
    await waitFor("document.querySelector('.trends select').value==='7' && document.querySelectorAll('.trends-chart').length===3");
    assert.equal(trendRequests, 2);
    assert.equal(await evaluate("JSON.parse(localStorage.getItem('keystats:trends')).range"), "7");
    await evaluate("[...document.querySelectorAll('.trends select')].find(s=>s.value==='rows').value='fingers'; [...document.querySelectorAll('.trends select')].find(s=>s.value==='fingers').dispatchEvent(new Event('change',{bubbles:true}))");
    await waitFor("document.querySelectorAll('.trends-chart[aria-label=\"Physical workload\"] .recharts-area').length === 11");
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('.trends-chart[aria-label="Physical workload"] .recharts-area-area')).some(path => (path.getAttribute('d')?.match(/M/g) || []).length >= 2)`), "Missing days must break the stacked areas");
    assert.equal(await evaluate("document.querySelectorAll('.trends-chart[aria-label=\"Volume\"] .recharts-line').length"), 1, "Volume must remain a line chart");
    await evaluate("[...document.querySelectorAll('.trends-options')].find(f=>f.querySelector('legend').textContent==='Physical categories').querySelector('input').click()");
    await waitFor("document.querySelectorAll('.trends-chart[aria-label=\"Physical workload\"] .recharts-area').length === 10");
    await evaluate("[...document.querySelectorAll('.trends select')].find(s=>s.value==='share' && s.parentElement.textContent.includes('Physical display')).value='count'; [...document.querySelectorAll('.trends select')].find(s=>s.value==='count' && s.parentElement.textContent.includes('Physical display')).dispatchEvent(new Event('change',{bubbles:true}))");
    await waitFor("JSON.parse(localStorage.getItem('keystats:trends')).physicalMeasure === 'count'");
    assert.equal(await evaluate("document.querySelectorAll('.trends-chart[aria-label=\"Physical workload\"] .recharts-area').length"), 10);
    assert.equal(trendRequests, 2, "Chart display changes must not refetch history");
    failTrend = true;
    await refresh();
    await waitFor("document.querySelector('.trends [role=alert]')?.textContent.includes('previous snapshot')");
    assert.equal(await evaluate("document.querySelectorAll('.trends-chart').length"), 3, "Refresh failures retain the previous snapshot");
    await evaluate("[...document.querySelectorAll('.trends button')].find(b=>b.textContent==='Retry').click()");
    await waitFor("!document.querySelector('.trends [role=alert]') && document.querySelectorAll('.trends-chart').length === 3");
    assert.equal(trendRequests, 4);
    assert.ok(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Trends must fit a mobile viewport");
    assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
    console.log("Browser smoke passed: layout comparison and Trends charts, caching, preferences, refresh/retry, date filtering and mobile layout.");
  } finally {
    socket?.close(); chrome.kill("SIGTERM"); await exited;
    server.closeAllConnections(); await new Promise((resolve) => server.close(resolve));
    // Only remove the unique test profile created above, never a real browser profile.
    // Chrome's helper processes can briefly finish writing after the parent exits.
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

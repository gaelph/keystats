const assert = require("node:assert/strict");
const { test } = require("node:test");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const os = require("node:os");

test("offline XML importer validates state transitions, exact Unicode and unsupported constructs", () => {
  const result = spawnSync("python3", ["-c", `
import importlib.util, os, tempfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('importer','scripts/import-layout-profiles.py')
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
base=Path(os.environ['KEYSTATS_TEST_TMP']); base.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory(prefix='layout-import-',dir=base) as temp:
    maps=[]
    for index in range(4):
        keys={code:'<key code="%s" output="a"/>'%code for code in m.VIRTUAL_KEYS.values()}
        keys[14]='<key code="14" action="acute"/>' if index==2 else '<key code="14" action="upper"/>' if index==1 else '<key code="14" action="letter"/>'
        keys[49]='<key code="49" action="space"/>'
        maps.append('<keyMap index="%s">%s</keyMap>'%(index,''.join(keys.values())))
    xml='''<?xml version="1.1"?><keyboard name="Synthetic">
    <modifierMap><keyMapSelect mapIndex="0"><modifier keys=""/></keyMapSelect>
    <keyMapSelect mapIndex="1"><modifier keys="anyShift"/></keyMapSelect>
    <keyMapSelect mapIndex="2"><modifier keys="anyOption"/></keyMapSelect>
    <keyMapSelect mapIndex="3"><modifier keys="anyShift anyOption"/></keyMapSelect></modifierMap>
    <keyMapSet id="ISO">'''+''.join(maps)+'''</keyMapSet>
    <actions><action id="acute"><when state="none" next="acute"/></action>
    <action id="letter"><when state="none" output="e"/><when state="acute" output="é"/></action>
    <action id="upper"><when state="none" output="E"/><when state="acute" output="É"/></action>
    <action id="space"><when state="none" output=" "/><when state="acute" output="´"/></action></actions>
    <terminators><when state="acute" output="´"/></terminators></keyboard>'''
    p=Path(temp)/'test.keylayout'; p.write_text(xml)
    layout=m.Keylayout(p,'ISO'); data=layout.profile()
    assert layout.translate(8,0,'acute')==('é','none')
    assert {'é','É'} <= {r['glyph'] for r in data['recipes']}
    assert all(len(r['steps'])==2 and r['glyph'] in m.ALLOWED for r in data['recipes'])
    p.write_text(xml.replace('output="é"','output="e&#x0301;"'))
    assert 'é' not in {r['glyph'] for r in m.Keylayout(p,'ISO').profile()['recipes']}
    p.write_text(xml.replace('state="acute" output="é"','state="1" through="9" output="é"'))
    try: m.Keylayout(p,'ISO')
    except ValueError: pass
    else: raise AssertionError('Unsupported state ranges must fail closed')
print('offline importer checks passed')
  `], { encoding: "utf8", timeout: 10000, env: { ...process.env,
    PYTHONDONTWRITEBYTECODE: "1", KEYSTATS_TEST_TMP: process.env.KEYSTATS_TEST_TMP || path.join(os.tmpdir(), "opencode") } });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  assert.match(result.stdout, /offline importer checks passed/);
});

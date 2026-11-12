// Development-only profile probe. Does not select or change an input source.
// Run: swift scripts/generate-layout-profiles.swift > <profile fixture path>
import Carbon
import Foundation

// USB keyboard usage -> macOS virtual key. Non-US # shares the backslash key.
let virtualKeys: [Int: Int] = [
    4: 0, 5: 11, 6: 8, 7: 2, 8: 14, 9: 3, 10: 5, 11: 4,
    12: 34, 13: 38, 14: 40, 15: 37, 16: 46, 17: 45, 18: 31,
    19: 35, 20: 12, 21: 15, 22: 1, 23: 17, 24: 32, 25: 9,
    26: 13, 27: 7, 28: 16, 29: 6, 30: 18, 31: 19, 32: 20,
    33: 21, 34: 23, 35: 22, 36: 26, 37: 28, 38: 25, 39: 29,
    44: 49, 45: 27, 46: 24, 47: 33, 48: 30, 49: 42, 50: 42,
    51: 41, 52: 39, 53: 50, 54: 43, 55: 47, 56: 44, 100: 10,
    84: 75, 85: 67, 86: 78, 87: 69, 89: 83, 90: 84, 91: 85,
    92: 86, 93: 87, 94: 88, 95: 89, 96: 91, 97: 92, 98: 82,
    99: 65, 103: 81,
]

func probe(_ sourceID: String, keyboardType: UInt32) -> [String: Any] {
    let filter = [kTISPropertyInputSourceID as String: sourceID] as CFDictionary
    let sources = TISCreateInputSourceList(filter, true).takeRetainedValue()
    precondition(CFArrayGetCount(sources) == 1, "Input source unavailable: \(sourceID)")
    let source = unsafeBitCast(CFArrayGetValueAtIndex(sources, 0), to: TISInputSource.self)
    guard let pointer = TISGetInputSourceProperty(source, kTISPropertyUnicodeKeyLayoutData) else {
        fatalError("No Unicode keyboard layout data: \(sourceID)")
    }
    let data = Unmanaged<CFData>.fromOpaque(pointer).takeUnretainedValue()
    let layout = UnsafeRawPointer(CFDataGetBytePtr(data)!).assumingMemoryBound(to: UCKeyboardLayout.self)

    func translate(_ key: Int, modifiers: Int, state: inout UInt32) -> String {
        var length = 0
        var chars = [UniChar](repeating: 0, count: 16)
        let carbonModifiers = ((modifiers & 2) != 0 ? shiftKey : 0)
            | ((modifiers & 4) != 0 ? optionKey : 0)
        let status = UCKeyTranslate(layout, UInt16(key), UInt16(kUCKeyActionDown),
            UInt32(carbonModifiers >> 8), keyboardType, 0, &state, 16, &length, &chars)
        precondition(status == noErr, "UCKeyTranslate failed: \(status)")
        return String(utf16CodeUnits: chars, count: length)
    }

    var outputs: [[String: Any]] = []
    var deadKeys: [(Int, Int)] = []
    var recipes: [[String: Any]] = []
    for usage in virtualKeys.keys.sorted() {
        for modifiers in [0, 2, 4, 6] {
            var state: UInt32 = 0
            // IOHID's ISO translation swaps these virtual positions before TIS.
            let virtualKey = keyboardType == 41 && usage == 53 ? 10
                : keyboardType == 41 && usage == 100 ? 50 : virtualKeys[usage]!
            let output = translate(virtualKey, modifiers: modifiers, state: &state)
            let dead = state != 0
            if dead && output.isEmpty && (usage <= 56 || usage == 100) {
                deadKeys.append((usage, modifiers))
            }
            let glyph = dead ? translate(49, modifiers: 0, state: &state) : output
            var plainState: UInt32 = 0
            let plainSpace = translate(49, modifiers: 0, state: &plainState)
            // Some Apple layouts retain a nonzero state even after emitting the
            // committed glyph. Verify a subsequent plain key, not state == 0.
            let nextSpace = dead ? translate(49, modifiers: 0, state: &state) : ""
            if !glyph.isEmpty {
                outputs.append(["usage": usage, "modifiers": modifiers, "glyph": glyph,
                    "dead": dead, "commitVerified": dead && nextSpace == plainSpace])
            }
        }
    }
    let frenchLetters = "éèêëàâäîïôöùûüÿçœæ"
    let allowed = Set((frenchLetters + frenchLetters.uppercased()).map(String.init))
    func keyFor(_ usage: Int) -> Int {
        return keyboardType == 41 && usage == 53 ? 10
            : keyboardType == 41 && usage == 100 ? 50 : virtualKeys[usage]!
    }
    for (first, firstModifiers) in deadKeys {
        for second in virtualKeys.keys.sorted() where second <= 56 || second == 100 {
            for secondModifiers in [0, 2, 4, 6] {
                var state: UInt32 = 0
                let prefix = translate(keyFor(first), modifiers: firstModifiers, state: &state)
                let glyph = translate(keyFor(second), modifiers: secondModifiers, state: &state)
                // Exact codepoints only: Swift String equality otherwise accepts
                // canonically equivalent decomposed strings.
                let exact = allowed.contains { Array($0.utf16) == Array(glyph.utf16) }
                guard prefix.isEmpty && exact else { continue }
                let next = translate(49, modifiers: 0, state: &state)
                var plain: UInt32 = 0
                guard Array(next.utf16) == Array(translate(49, modifiers: 0, state: &plain).utf16) else { continue }
                recipes.append(["glyph": glyph, "steps": [
                    ["usage": first, "modifiers": firstModifiers],
                    ["usage": second, "modifiers": secondModifiers],
                ]])
            }
        }
    }
    return ["inputSourceID": sourceID, "keyboardType": keyboardType, "outputs": outputs, "recipes": recipes]
}

var result: [String: Any] = [
    "provenance": "UCKeyTranslate, key-down, dead-key state reset per probe; dead glyph verified by unmodified Space",
    "os": ProcessInfo.processInfo.operatingSystemVersionString,
    "french": probe("com.apple.keylayout.French", keyboardType: 41),
    "us": probe("com.apple.keylayout.US", keyboardType: 40),
]
if CommandLine.arguments.contains("--recipes-only") {
    for name in ["french", "us"] {
        let profile = result[name] as! [String: Any]
        result[name] = ["inputSourceID": profile["inputSourceID"]!, "recipes": profile["recipes"]!]
    }
}
let json = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
FileHandle.standardOutput.write(json)
FileHandle.standardOutput.write(Data("\n".utf8))

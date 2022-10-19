import asc from "assemblyscript/asc";
import parserTypeScript from "parser-typescript";
import { Massa } from "./libs/massa-as-sdk.js";
import { Envy } from "./libs/unittest.js";
import { initMirrorContractValue, initMirrorTestValue } from "./libs/init-values.js";


// Runtime header offsets
const ID_OFFSET = -8;
const SIZE_OFFSET = -4;

// Runtime ids
const ARRAYBUFFER_ID = 0;
const STRING_ID = 1;
// const ARRAYBUFFERVIEW_ID = 2;

// Runtime type information
const ARRAYBUFFERVIEW = 1 << 0;
const ARRAY = 1 << 1;
const STATICARRAY = 1 << 2;
// const SET = 1 << 3;
// const MAP = 1 << 4;
const VAL_ALIGN_OFFSET = 6;
// const VAL_ALIGN = 1 << VAL_ALIGN_OFFSET;
const VAL_SIGNED = 1 << 11;
const VAL_FLOAT = 1 << 12;
// const VAL_NULLABLE = 1 << 13;
const VAL_MANAGED = 1 << 14;
// const KEY_ALIGN_OFFSET = 15;
// const KEY_ALIGN = 1 << KEY_ALIGN_OFFSET;
// const KEY_SIGNED = 1 << 20;
// const KEY_FLOAT = 1 << 21;
// const KEY_NULLABLE = 1 << 22;
// const KEY_MANAGED = 1 << 23;

// Array(BufferView) layout
const ARRAYBUFFERVIEW_BUFFER_OFFSET = 0;
const ARRAYBUFFERVIEW_DATASTART_OFFSET = 4;
const ARRAYBUFFERVIEW_BYTELENGTH_OFFSET = 8;
const ARRAYBUFFERVIEW_SIZE = 12;
const ARRAY_LENGTH_OFFSET = 12;
const ARRAY_SIZE = 16;

const E_NO_EXPORT_TABLE   = "Operation requires compiling with --exportTable";
const E_NO_EXPORT_RUNTIME = "Operation requires compiling with --exportRuntime";
const F_NO_EXPORT_RUNTIME = () => { throw Error(E_NO_EXPORT_RUNTIME); };

const BIGINT = typeof BigUint64Array !== "undefined";
const THIS = Symbol();

const STRING_SMALLSIZE = 192; // break-even point in V8
const STRING_CHUNKSIZE = 1024; // mitigate stack overflow
const utf16 = new TextDecoder("utf-16le", { fatal: true }); // != wtf16

window.DecodeUrl = (url) => {
    if (url.lastIndexOf("?") != -1)
        initMirrorContractValue = atob(url.substring(url.lastIndexOf("?") + 1));
};
DecodeUrl(window.location.href);

function initCodeMirrors(fileName, initValue, id, value) {
    if (localStorage.getItem(fileName) == null || localStorage.getItem(fileName) == "") {
        value = initValue;
    } else {
        value = localStorage.getItem(fileName);
    }

    let mirror = CodeMirror(document.querySelector(id), {
        lineNumbers: true,
        tabSize: 2,
        value: value,
        mode: "javascript",
        theme: "monokai",
    });
    mirror.setSize("100%", "100%");
    mirror.on("change", function (cm, change) {
        localStorage.setItem(fileName, mirror.getValue());
    });
    mirror.setSize("100%", "100%");
    return mirror;
}

function formatCode(mirrors) {
    mirrors.forEach((mirror) => {
        mirror.setValue(
            prettier.format(mirror.getValue(), {
                semi: false,
                parser: "typescript",
                plugins: [parserTypeScript],
            })
        );
    });
}

let mirrorContractValue;
let mirrorTestValue;

const mirrorContract = initCodeMirrors(
    "main.ts",
    initMirrorContractValue,
    "#mirror-contract",
    mirrorContractValue
);

const mirrorTest = initCodeMirrors("test.ts", initMirrorTestValue, "#mirror-test", mirrorTestValue);

let consoleValue = "";

// Set the Console Value
function setConsoleValue(type, message) {
    if (type == "clear") {
        consoleValue = "";
        $("#console").html("");
    } else {
        let headerSpan;
        if (type == "log") {
            headerSpan = `<span style="color: grey">`;
        }
        if (type == "error") {
            headerSpan = `<span style="color: red">`;
        }
        if (type == "event") {
            headerSpan = `<span style="color: green">`;
        }
        consoleValue += "<br>" + headerSpan + message + "</span>";
        $("#console").html(consoleValue);
    }
}



// Compile Smart Contract
const outputs = {};
window.compileAS = async function (inputFile, outputName, isWriteCompiled) {
    const contractFormatted = mirrorContract
        .getValue()
        .replace("@massalabs/massa-as-sdk", "./@massalabs/massa-as-sdk.ts");

    const testFormatted = mirrorTest
        .getValue()
        .replace("@massalabs/massa-as-sdk", "./@massalabs/massa-as-sdk.ts");

    const files = {
        "main.ts": contractFormatted,
        "@massalabs/massa-as-sdk.ts": Massa,
        "allFiles.ts": Envy + contractFormatted + testFormatted,
    };
    console.log(files["allFiles.ts"]);

    const { error, stdout, stderr } = await asc.main(
        [
            inputFile + ".ts",
            "-t",
            "--textFile",
            outputName + ".wat",
            "--outFile",
            outputName + ".wasm",
            "--bindings",
            "raw",
            '--exportRuntime',
        ],
        {
            readFile: (name, baseDir) => {
                setConsoleValue("log", "readFile:" + name + ", baseDir=" + baseDir);
                if (Object.prototype.hasOwnProperty.call(files, name)) return files[name];
                return null;
                },
            writeFile: (name, data, baseDir) => {
                setConsoleValue("log", "writeFile: " + name + ", baseDir=" + baseDir);
                outputs[name] = data;
            },
            listFiles: (dirname, baseDir) => {
                setConsoleValue("log", "listFiles:" + dirname + ", baseDir=" + baseDir);
                return [];
            },
        }
    );
    if (error) {
        setConsoleValue("error", "Compilation failed: " + error.message);
        setConsoleValue("error", stderr.toString());
    }
    else if (isWriteCompiled) {
        setConsoleValue("log", stdout.toString());
        setConsoleValue("log", outputs[outputName + ".wat"]);
    }
    return outputs;
}

window.ShareCode = () => {
    let encoded = btoa(mirrorContract.getValue());
    navigator.clipboard.writeText(window.location.href + "?" + encoded);
    // Alert the copied text
    alert("Link copied in clipboard");
};

window.exportFile = (fileName) => {
    const contractFormatted = mirrorContract
        .getValue()
        .replace("@massalabs/massa-as-sdk", "./@massalabs/massa-as-sdk.ts");

    const testFormatted = mirrorTest
        .getValue()
        .replace("@massalabs/massa-as-sdk", "./@massalabs/massa-as-sdk.ts");

    const files = {
        "main.ts": contractFormatted,
        "@massalabs/massa-as-sdk.ts": Massa,
        "allFiles.ts": Envy + contractFormatted + testFormatted,
    };

    let file =
        files[fileName] == null || files[fileName] == "" ? outputs[fileName] : files[fileName];
    let blob = new Blob([file], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
};

window.handleClickExportCompiled = () => {
    exportFile("main.wat");
};

window.handleClickExport = () => {
    exportFile("main.ts");
};

window.handleClickShare = () => {
    ShareCode();
};
window.handleClickCompile = () => {
    compileAS("main", "main", true);
};
window.handleClickClear = () => {
    setConsoleValue("clear", "");
};
window.handleClickFormat = () => formatCode([mirrorContract, mirrorTest]);

window.handleClickDiscard = () => {
    localStorage.setItem("main.ts", null), mirrorContract.setValue("");
    localStorage.setItem("test.ts", null), mirrorTest.setValue("");
};

window.handleClickRunTests = () => {    
    runUnitTest();
};

window.runUnitTest = async function () {
    // Compile Smart Contract
    const outputs = await window.compileAS("allFiles", "allFiles", false);
    const testModule = await WebAssembly.compile(outputs["allFiles.wasm"]);
    const memory = new WebAssembly.Memory({ initial: 4 });
    const Storage = new Map();

    function convert(instance, string) {
        const rawLen = new Uint8Array(instance.exports.memory.buffer, string - 4, 4);
        const len = new DataView(rawLen.buffer).getUint32(string - 4, true);
        const rawMsg = new Uint8Array(instance.exports.memory.buffer, string, len);
        const msg = new TextDecoder().decode(rawMsg);
        return msg;
    }
    
    const imports = {
        env: {
            memory,
            abort(msg, file, line, col) {
                const text = convert(instanceTest, msg);
                const filestr = convert(instanceTest, file);
                setConsoleValue("error", text +","+filestr +","+line.toString() );
            },
            log(ptr) {
                const msg = convert(instanceTest, ptr);
                setConsoleValue("log", msg);
            },
        },
        massa: {
            memory,
            assembly_script_generate_event(string) {
                const msg = convert(instanceTest, string);
                setConsoleValue("event", msg);
            },
            assembly_script_set_data_for(address, key, value) {
                const addressStr = convert(instanceTest,address);
                const keyStr = convert(instanceTest,key);
                const valueStr = convert(instanceTest,value);

                if (!Storage.has(addressStr)) {
                    Storage.set(addressStr, new Map());
                }
                const addressStorage = Storage.get(addressStr);

                addressStorage.set(keyStr, valueStr);
                console.log(Storage);
            },
            assembly_script_get_data_for(address, key) {
                let value = "";
                const addressStr = convert(instanceTest,address);
                const keyStr = convert(instanceTest,key);

                if (Storage.has(addressStr)) {
                    const addressStorage = Storage.get(addressStr);
                    if (addressStorage.has(keyStr)) {
                        value = addressStorage.get(keyStr);
                        console.log(value);
                    }
                    
                }
                const ptr = __newString(value);
                return ptr;
            },
        },
    };
    
    const instanceTest = await WebAssembly.instantiate(testModule, imports);
    console.log(instanceTest);
    const exports = instanceTest.exports;
    
      /** Allocates a new string in the module's memory and returns its pointer. */
  function __newString(str) {
    if (str == null) return 0;
    const length = str.length; 
    const ptr = exports.__new(length << 1, STRING_ID);
    const U16 = new Uint16Array(memory.buffer);
    for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
    return ptr; 
  }

    instanceTest.exports._startTests();
};

import asc from "assemblyscript/asc";
import parserTypeScript from "parser-typescript";
import { Massa } from "./libs/massa-as-sdk.js";
import { Envy } from "./libs/unittest.js";
import { initMirrorContractValue, initMirrorTestValue } from "./libs/init-values.js";

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
window.compileAS = async function (inputFile, outputName) {
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
    } else {
        setConsoleValue("log", stdout.toString());
        setConsoleValue("log", outputs[outputName + ".wat"]);
    }
    return outputs;
};

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
    compileAS("main", "main");
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
    const outputs = await window.compileAS("allFiles", "allFiles");
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
                setConsoleValue("error", text);
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
                if (!Storage.has(address)) {
                    Storage.set(address, new Map());
                }
                const addressStorage = Storage.get(address);
                addressStorage.set(key, value);
            },
            assembly_script_get_data_for(address, key) {
                let value = "";
                if (Storage.has(address)) {
                    const addressStorage = Storage.get(address);
                    if (addressStorage.has(key)) {
                        value = addressStorage.get(key);
                    }
                }
                return value;
            },
        },
    };
    const instanceTest = await WebAssembly.instantiate(testModule, imports);

    instanceTest.exports._startTests();
};

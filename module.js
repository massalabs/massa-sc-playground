import asc from "assemblyscript/asc";
import parserTypeScript from "parser-typescript";
import { Massa } from "./libs/massa-as-sdk.js";
import { Envy } from "./libs/unittest.js";
import { initMirrorContractValue, initMirrorTestValue } from "./libs/init-values.js";

let initContractValue = initMirrorContractValue;
let initTestValue = initMirrorContractValue;

const SIZE_OFFSET = -4;
const STRING_ID = 1;
const utf16 = new TextDecoder("utf-16le", { fatal: true }); // != wtf16

function parseURLParams() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const code = params.get("code");
    const test = params.get("test");
    return {
        code,
        test,
    };
}
function DecodeUrl() {
    const params = parseURLParams();
    initContractValue =
        params.code !== null ? decodeURIComponent(atob(params.code)) : initContractValue;
    initTestValue =
        params.test !== null ? decodeURIComponent(atob(params.test)) : initMirrorTestValue;
}

DecodeUrl();

function initCodeMirrors(fileName, initValue, id, value) {
    if (
        localStorage.getItem(fileName) == null ||
        localStorage.getItem(fileName) == "" ||
        (parseURLParams().code && parseURLParams().test)
    ) {
        value = initValue;
    } else {
        value = localStorage.getItem(fileName);
    }

    let mirror = CodeMirror(document.querySelector(id), {
        lineNumbers: true,
        tabSize: 2,
        value: value,
        mode: "javascript",
        theme: "material-ocean",
    });

    mirror.setSize("100%", "100%");
    mirror.on("change", function (cm, change) {
        // Do not update if code is from a sharing link in order top don't override contracts
        if (!parseURLParams().code && !parseURLParams().params) {
            localStorage.setItem(fileName, mirror.getValue());
        }
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
    initContractValue,
    "#mirror-contract",
    mirrorContractValue
);

const mirrorTest = initCodeMirrors("test.ts", initTestValue, "#mirror-test", mirrorTestValue);

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
        consoleValue += headerSpan + message + "</span>" + "<br>";
        $("#console").html(consoleValue);
    }
}

function scrollDownToConsole() {
    $("#console").scrollTop($("#console")[0].scrollHeight);
}

// Compile Smart Contract
const outputs = {};
window.compileAS = async function (inputFile, outputName, isWriteCompiled) {
    if (isWriteCompiled) {
        setConsoleValue(
            "log",
            ` <br><br> ****************************
        COMPILATION 
        **************************** <br><br>`
        );
    }

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
            "--exportRuntime",
        ],
        {
            readFile: (name, baseDir) => {
                if (Object.prototype.hasOwnProperty.call(files, name)) return files[name];
                return null;
            },
            writeFile: (name, data, baseDir) => {
                outputs[name] = data;
            },
            listFiles: (dirname, baseDir) => {
                return [];
            },
        }
    );
    if (error) {
        setConsoleValue("error", "Compilation failed: " + error.message);
        setConsoleValue("error", stderr.toString());
    } else if (isWriteCompiled) {
        setConsoleValue("log", stdout.toString());
        setConsoleValue("log", outputs[outputName + ".wat"]);
    }
    scrollDownToConsole();
    return outputs;
};

window.ShareCode = async () => {
    let contractEncoded = btoa(encodeURIComponent(mirrorContract.getValue()));
    let unitTestEncoded = btoa(encodeURIComponent(mirrorTest.getValue()));

    const urlGenerated =
        window.location.host +
        window.location.pathname +
        "?code=" +
        contractEncoded +
        "&test=" +
        unitTestEncoded;

    let alertMessage;
    if (urlGenerated.length <= 4000) {
        await navigator.clipboard.writeText(urlGenerated);
        alertMessage = "Link copied in clipboard";
    } else {
        alertMessage = "Error: Code is too long to be shared through URL";
    }
    // Alert the copied text
    alert(alertMessage);
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
    //If contract is not Compiled, Compile Smart Contract before exporting
    if (outputs["main.wasm"] == null) {
        compileAS("main", "main", false);
    }
    exportFile("main.wasm");
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

// Permit to select .json file in the file explorer
window.handleClickSimulate = async () => {
    // Trigger the input file explorer
    const executionConfigFile = await document.getElementById("upload").click();

    // Start Export Compiled File and send the file to the simulator
    // Compile the contract
    compileAS("main", "main", false).then(
        (outputs) => {
            // Create the compiled file to the simulator
            const file = new File([outputs["main.wasm"]], "main.wasm", {
                type: "application/wasm",
            });
            // Create the form data
            const formData = new FormData();
            //Adding wasm file to the form data
            formData.append("file", file);
            //Adding Configuration file to the form data
            formData.append("config", executionConfigFile);

            // Send the file to the simulator
            fetch("http://localhost:8080/simulate", {
                method: "POST",
                body: formData,
            })
                //Todo handle the response, maybe the response will be asynchrone and take time to be ready
                .then((response) => response.text())
                .then((text) => {
                    setConsoleValue(
                        "log",
                        ` <br><br> ****************************
            SIMULATION 
            **************************** <br><br>`
                    );
                    setConsoleValue("log", text);
                    scrollDownToConsole();
                })
                .then(getTraceFileFromSimulator)
                .then(getLedgerFileFromSimulator);
            // Handle Trace Result
            // Handle Ledger Result
        },
        (error) => {
            setConsoleValue("error", "Uploading Contract to simulator failed : " + error.message);
            setConsoleValue("error", stderr.toString());
        }
    );

    // 	curl -X POST http://localhost:8080/upload \
    //   -F "files=@./simulator_config.json" \
    //   -F "files=@./main.wasm" \
    //   -H "Content-Type: multipart/form-data"
};

//Parse the Json file to get all the name of "execute_step" and print it in the console
const handleTraceResult = (traceResult) => {
    const a = (output) => {
        traceResult.execute_slot.output.forEach(
            (element) => {
                if (element["name"] == "output") {
                    a(element["output"]);
                    setConsoleValue("log", Object.keys(element));
                }
                //Display the key output of the element
                setConsoleValue("log", Object.keys(element));
            },
            (error) => {
                setConsoleValue(
                    "error",
                    "Uploading Contract to simulator failed : " + error.message
                );
                setConsoleValue("error", stderr.toString());
            }
        );

        const traceResultJson = JSON.parse(traceResult);
        traceResultJson.forEach((element) => {
            const stepName = element["execute_step"]["name"];
            setConsoleValue("log", `Step Name : ${stepName} <br>`);
        });
    };

    //TODO : Get Request to the simulator to get the trace file
    const getTraceFileFromSimulator = () => {
        let traceResult;
        fetch("http://localhost:8080/upload", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": (filename = "trace.json"),
            },
        })
            .then((response) => response.text())
            .then((text) => {
                setConsoleValue(
                    "log",
                    ` <br><br> ****************************
        SIMULATION TRACE RESULT 
        **************************** <br><br>`
                );
                setConsoleValue("log", text);
                scrollDownToConsole();
            })
            .then(() => {
                var file = window.URL.createObjectURL(traceResult);
                window.location.assign(file);
            });
        //TODO : Handle the error
        //TODO : Handle the trace file name
    };
    //TODO : Get Request to the simulator to get the legdger file
    const getLedgerFileFromSimulator = () => {
        let ledgerResult;
        fetch("http://localhost:8080/upload", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": (filename = "ledger.json"),
            },
        })
            .then((response) => {
                ledgerResult = response;
                response.text();
            })
            .then((text) => {
                setConsoleValue(
                    "log",
                    ` <br><br> ****************************
        SIMULATION LEDGER RESULT 
        **************************** <br><br>`
                );
                setConsoleValue("log", text);
                scrollDownToConsole();
            })
            .then(() => {
                var file = window.URL.createObjectURL(ledgerResult);
                window.location.assign(file);
            });
        //TODO : Handle the error
        //TODO : Handle the ledger file name
    };
};

window.handleClickFormat = () => formatCode([mirrorContract, mirrorTest]);

window.handleClickDiscard = () => {
    localStorage.setItem("main.ts", null), mirrorContract.setValue("");
    localStorage.setItem("test.ts", null), mirrorTest.setValue("");
};

window.handleClickRunTests = () => {
    runUnitTest();
};

/** Retrieve the string linked to the ptr in memory */
function getString(ptr, xpt) {
    const len = new Uint32Array(xpt.memory.buffer)[(ptr + SIZE_OFFSET) >>> 2] >>> 1;
    const wtf16 = new Uint16Array(xpt.memory.buffer, ptr, len);
    return utf16.decode(wtf16);
}

/** Allocates a new string in the module's memory and returns its pointer. */
function newString(str, xpt) {
    if (str == null) return 0;
    const length = str.length;
    const ptr = xpt.__new(length << 1, STRING_ID);
    const U16 = new Uint16Array(xpt.memory.buffer);
    for (let i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
    return ptr;
}

window.runUnitTest = async function () {
    setConsoleValue(
        "log",
        ` <br><br> ****************************
        TESTING 
        **************************** <br><br>`
    );
    // Compile Smart Contract
    const outputs = await window.compileAS("allFiles", "allFiles", false);
    const testModule = await WebAssembly.compile(outputs["allFiles.wasm"]);
    const memory = new WebAssembly.Memory({ initial: 4 });
    const Storage = new Map();

    const imports = {
        env: {
            memory,
            abort(msgPtr, filePtr, linePtr, colPtr) {
                const msgStr = getString(msgPtr, instanceTest.exports);
                const fileStr = getString(filePtr, instanceTest.exports);
                const lineStr = getString(linePtr, instanceTest.exports);
                const colStr = getString(colPtr, instanceTest.exports);
                setConsoleValue(
                    "error",
                    `Error : ${msgStr} in ${fileStr} at line ${lineStr}, col ${colStr} `
                );
            },
            log(ptr) {
                const msg = getString(ptr, instanceTest.exports);
                const logCode = msg.includes("Error") ? "error" : "log";
                setConsoleValue(logCode, msg);
            },
        },
        massa: {
            memory,
            assembly_script_generate_event(string) {
                const msg = getString(string, instanceTest.exports);
                setConsoleValue("event", msg);
            },
            assembly_script_set_data_for(address, key, value) {
                const addressStr = getString(address, instanceTest.exports);
                const keyStr = getString(key, instanceTest.exports);
                const valueStr = getString(value, instanceTest.exports);
                if (!Storage.has(addressStr)) {
                    Storage.set(addressStr, new Map());
                }
                const addressStorage = Storage.get(addressStr);
                addressStorage.set(keyStr, valueStr);
            },
            assembly_script_get_data_for(address, key) {
                let value = "";
                const addressStr = getString(address, instanceTest.exports);
                const keyStr = getString(key, instanceTest.exports);
                if (Storage.has(addressStr)) {
                    const addressStorage = Storage.get(addressStr);
                    if (addressStorage.has(keyStr)) {
                        value = addressStorage.get(keyStr);
                    }
                }
                const ptr = newString(value, instanceTest.exports);
                return ptr;
            },
        },
    };

    const instanceTest = await WebAssembly.instantiate(testModule, imports).catch((err) => {
        setConsoleValue("error", err);
    });

    await instanceTest.exports._startTests();

    scrollDownToConsole();
};

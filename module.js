import asc from "assemblyscript/asc";
import parserTypeScript from "parser-typescript";
import Massa from "./massa-as-sdk.js";

window.compiledFiled = "";

let initMirrorValue = "export function add(a: i32, b: i32): i32 {  return a + b;}";

if (localStorage.getItem("main.ts") != null) {
    initMirrorValue = localStorage.getItem("main.ts");
}

window.mirror = CodeMirror(document.querySelector("#codemirror"), {
    lineNumbers: true,
    tabSize: 2,
    value: initMirrorValue,
    mode: "javascript",
    theme: "monokai",
});

mirror.setSize("100%", "100%");
window.formatCode = () => {
    mirror.setValue(
        prettier.format(mirror.getValue(), {
            semi: false,
            parser: "typescript",
            plugins: [parserTypeScript],
        })
    );
};

mirror.setSize("100%", "100%");
let consoleValue = "";

// Set the Console Value

function setConsoleValue(message) {
    if (message == "clear") {
        consoleValue = "";
        $("#console").val("");
    } else {
        consoleValue = consoleValue + message;
        $("#console").val(consoleValue);
    }
}

// Compile Smart Contract

let codeCompile = "";

window.compileAS = async function (codeCompile) {
    codeCompile = mirror.getValue();
    if (codeCompile == "") {
        codeCompile = "export function add(a: i32, b: i32): i32 {  return a + b;}";
    }
    let massa = Massa();

    const codeCompileFormatted = codeCompile.replace(
        "@massalabs/massa-as-sdk",
        "./@massalabs/massa-as-sdk.ts"
    );

    const files = {
        "main.ts": codeCompileFormatted,
        "@massalabs/massa-as-sdk.ts": massa,
    };
    const { error, stdout, stderr } = await asc.main(["main.ts", "-t"], {
        readFile: (name, baseDir) => {
            console.log("readFile: " + name + ", baseDir=" + baseDir);
            setConsoleValue("readFile: " + name + ", baseDir=" + baseDir);
            if (Object.prototype.hasOwnProperty.call(files, name)) return files[name];
            return null;
        },
        writeFile: (name, data, baseDir) => {
            console.log("writeFile: " + name + ", baseDir=" + baseDir);
            setConsoleValue("writeFile: " + name + ", baseDir=" + baseDir);
        },
        listFiles: (dirname, baseDir) => {
            console.log("listFiles: " + dirname + ", baseDir=" + baseDir);
            setConsoleValue("listFiles: " + dirname + ", baseDir=" + baseDir);
            return [];
        },
    });
    if (error) {
        console.log("Compilation failed: " + error.message);
        setConsoleValue("Compilation failed: " + error.message);
        console.log(stderr.toString());
        setConsoleValue(stderr.toString());
    } else {
        console.log(stdout.toString());
        setConsoleValue(stdout.toString());
        compiledFiled = stdout.toString();
    }
};

mirror.on("change", function (cm, change) {
    localStorage.setItem("main.ts", mirror.getValue());
});

window.handleClickCompile = () => {
    compileAS(codeCompile);
};
window.handleClickClear = () => {
    setConsoleValue("clear");
};
window.handleClickFormat = () => formatCode();
window.handleClickDiscard = () => {
    localStorage.setItem("main.ts", ""), mirror.setValue("");
};

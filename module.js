import asc from "assemblyscript/asc";
import parserTypeScript from "parser-typescript";
import Massa from "./massa-as-sdk.js";

window.compiledFiled = "";
let initMirrorValue = "export function add(a: i32, b: i32): i32 {  return a + b;}";

if (localStorage.getItem("main.ts") != null) {
    initMirrorValue = localStorage.getItem("main.ts");
}

window.DecodeUrl = (url) => {
    if (url.lastIndexOf("?") != -1) initMirrorValue = atob(url.substring(url.lastIndexOf("?") + 1));
};
DecodeUrl(window.location.href);
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
            setConsoleValue("readFile: " + name + ", baseDir=" + baseDir);
            if (Object.prototype.hasOwnProperty.call(files, name)) return files[name];
            return null;
        },
        writeFile: (name, data, baseDir) => {
            setConsoleValue("writeFile: " + name + ", baseDir=" + baseDir);
        },
        listFiles: (dirname, baseDir) => {
            setConsoleValue("listFiles: " + dirname + ", baseDir=" + baseDir);
            return [];
        },
    });
    if (error) {
        setConsoleValue("Compilation failed: " + error.message);
        setConsoleValue(stderr.toString());
    } else {
        setConsoleValue(stdout.toString());
        compiledFiled = stdout.toString();
    }
};
mirror.on("change", function (cm, change) {
    localStorage.setItem("main.ts", mirror.getValue());
});

window.ShareCode = () => {
    let encoded = btoa(mirror.getValue());
    navigator.clipboard.writeText(window.location.href + "?" + encoded);
    // Alert the copied text
    alert("Link copied in clipboard");
};

window.exportCompiledCode = () => {
    let blob = new Blob([compiledFiled], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "compiled.wat";
    link.href = url;
    link.click();
};
window.handleClickExportCompiled = () => {
    exportCompiledCode();
};

window.handleClickShare = () => {
    ShareCode();
};
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

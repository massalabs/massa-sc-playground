import { mirrorContract } from "./module.js";
let code = "";
function exportTSfromText(code) {
    code = mirrorContract.getValue();
    if (code == "") {
        code = "export function add(a: i32, b: i32): i32 {  return a + b;}";
    }
    let blob = new Blob([code], { type: "application/typescript" });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "code.ts";
    link.href = url;
    link.click();
}

window.handleClickExport = () => {
    exportTSfromText(code);
};

//Exporting written file

let code = "";
function exportTSfromText(code) {
    code = mirror.getValue();
    if (code == "") {
        code = "export function add(a: i32, b: i32): i32 {  return a + b;}";
    }
    blob = new Blob([code], { type: "application/typescript" });
    url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "code.ts";
    link.href = url;
    link.click();
}
const handleClickExport = () => {
    exportTSfromText(code);
};

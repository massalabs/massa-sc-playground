import "vs/language/typescript/tsWorker";
import { Linter } from "eslint";
// const TypescriptParser = require("browser-typescript-parser").TypescriptParser;

export async function handleClickLint() {
    applyLint(mirror.getValue());
}

export function handleClickDiscard() {
    localStorage.setItem("main.ts", ""), mirror.setValue("");
}

// Linter helpers:
async function lint(sourceCode) {
    const linter = await createLinter();

    return linter.verify(sourceCode, {
        ...(await getESLintrc()),
    });
}

async function getESLintrc() {
    return await (await fetch(".eslintrc.json")).json();
}

async function createLinter() {
    const linter = new Linter();

    // linter.defineParser("@typescript-eslint/parser", {
    //     async parse(code, options) {
    //         const parser = new TypescriptParser();
    //         const parsed = await parser.parseSource(code);
    //     },
    // });

    return linter;
}

async function applyLint(value) {
    mirror.clearGutter("error");
    const errors = await lint(value);
    console.log(errors); // DEBUG
    for (const error of errors) {
        mirror.setGutterMarker(error.line - 1, "error", makeMarker(error.message));
    }
}

function makeMarker(msg) {
    const marker = document.createElement("div");
    marker.classList.add("error-marker");
    marker.innerHTML = "&nbsp;";
    const error = document.createElement("div");
    error.innerHTML = msg;
    error.classList.add("error-message");
    marker.appendChild(error);
    return marker;
}

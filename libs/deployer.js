export const deployerContract = `{

    import { createSC, generateEvent, fileToBase64 } from '@massalabs/massa-as-sdk';
    
    export function main(_args: string): i32 {
        const bytes = fileToBase64('./main.wasm');
        const websiteDeployer = createSC(bytes);
        return websiteDeployer;
    }`
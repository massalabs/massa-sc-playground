export const deployerContract = (base64wasm) =>
`import { createSC, generateEvent, fileToBase64 } from './@massalabs/massa-as-sdk';

export function main(_args: string): i32 {
    const bytes = "${base64wasm}";
    const websiteDeployer = createSC(bytes);
    generateEvent(\`Contract deploy at : \${websiteDeployer._value}\`);
    return 0;
    }`;

// At the moment, the Playground has a few functionality limitations
// Only the simple Storage interactions are possible with getOf & setOf functions
import { getOf, setOf, Address, generateEvent } from "@massalabs/massa-as-sdk";

const balanceKey = "balance";
const totalSupplyKey = "totalSupply";

const ERC20 = new Address("A1UcnkarCtykM9T5PJ4tKKktyaFQu1GbPeE1QyxrB1T8qXA524n");

// Mint an amount of token to an address
export function mint(amount: u64, to: Address): void {
    const rawBal = getOf(ERC20, balanceKey + to._value);
    const rawTotalSupply = getOf(ERC20, totalSupplyKey);
    let bal: u64 = 0;
    let totalSupply: u64 = 0;

    if (rawBal) {
        bal = u64(parseInt(rawBal));
    }
    if (rawTotalSupply) {
        totalSupply = u64(parseInt(rawTotalSupply));
    }

    bal += amount;
    totalSupply += amount;

    setOf(ERC20, totalSupplyKey, totalSupply.toString());
    setOf(ERC20, balanceKey + to._value, bal.toString());

    generateEvent(amount.toString() + " token minted on " + to._value);
}

// Burn an amount of token from an address
export function burn(amount: u64, to: Address): void {
    const rawBal = getOf(ERC20, balanceKey + to._value);
    const rawTotalSupply = getOf(ERC20, totalSupplyKey);
    let bal: u64 = 0;
    let totalSupply: u64 = 0;

    if (rawTotalSupply) {
        totalSupply = u64(parseInt(rawTotalSupply));
    }

    if (rawBal) {
        bal = u64(parseInt(rawBal));
        bal -= amount;
        totalSupply -= amount;

        setOf(ERC20, totalSupplyKey, totalSupply.toString());
        setOf(ERC20, balanceKey + to._value, bal.toString());

        generateEvent(amount.toString() + " token burnt on " + to._value);
    } else {
        generateEvent("No token to burn on " + to._value + " address");
    }
}

import { getOf, Address } from "@massalabs/massa-as-sdk";

const ERC20Address = new Address("A1UcnkarCtykM9T5PJ4tKKktyaFQu1GbPeE1QyxrB1T8qXA524n");
const testAddress = new Address("A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR");

describe("Mint Testing", () => {
    test("Test state initialization : Balance", () => {
        let got = getOf(ERC20Address, balanceKey + testAddress._value);
        if (got != "") {
            error("The balance key for this balance must be not yet initialized");
            return;
        }
    });

    test("Test state initialization : Total Supply", () => {
        let got = getOf(ERC20Address, totalSupplyKey);
        if (got != "") {
            error("The totalSupply key for this balance must be not yet initialized");
            return;
        }
    });

    test("Test post minting : Balance", () => {
        mint(10000000, testAddress);
        const got = getOf(ERC20Address, balanceKey + testAddress._value);
        let want = "10000000";
        if (got != want) {
            error("Balance value must be" + want);
            return;
        }
    });

    test("Test post minting : TotalSupply", () => {
        const got = getOf(ERC20Address, totalSupplyKey);
        let want = "10000000";
        if (got != want) {
            error("TotalSupply value must be 10000000" + want);
            return;
        }
    });
});

describe("Burn testing", () => {
    test("Test post burn : Balance ", () => {
        burn(5000, testAddress);
        let got = getOf(ERC20Address, balanceKey + testAddress._value);
        const want = "9995000";
        if (got != want) {
            error(got.toString() + ", " + want.toString() + " was expected.");
            return;
        }
    });

    test("Test post burn : TotalSupply ", () => {
        let got = getOf(ERC20Address, totalSupplyKey);
        const want = "9995000";
        if (got != want) {
            error(got.toString() + ", " + want.toString() + " was expected.");
            return;
        }
    });
});

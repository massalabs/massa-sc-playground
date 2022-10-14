export let initMirrorTestValue = `import { getOf } from "@massalabs/massa-as-sdk"

describe("A group of test", () => {
  test("A test throwing an error", () => {
    event()
    const got = 42
    const want = 41
    if (got != want) {
      error(got.toString() + ", " + want.toString() + " was expected.")
      return
    }
  })
})

describe("An other group of test", () => {
  test("Testing the Storage", () => {
    setStorage()
    assert(
      getOf(
        new Address("A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR"),
        "test"
      ) == "value",
      "Test failed"
    )
  })
})`;

export let initMirrorContractValue = `import { setOf, Address, generateEvent } from "@massalabs/massa-as-sdk"

export function add(a: i32, b: i32): i32 {
  return a + b
}

const testAddress = new Address(
  "A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR"
)

export function setStorage(): void {
  setOf(testAddress, "test", "value")
}

export function event(): void {
  generateEvent("I'm an event ")
}

    `;

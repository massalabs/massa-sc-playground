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
    const got = getOf(
      new Address("A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR"),
      "test"
    )
    const want = "value"
    if (got != want) {
      error(got.toString() + ", " + want.toString() + " was expected.")
      return
    }
  })
})`;

export let initMirrorContractValue = `// At the moment, the Playground has a few functionality limitations
// Only the simple Storage interactions are possible with getOf & setOf functions
// Random Number generation is also possible with unsafeRandom function
import {
  setOf,
  Address,
  generateEvent,
  unsafeRandom,
} from "@massalabs/massa-as-sdk"

const testAddress = new Address(
  "A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR"
)

export function setStorage(): void {
  setOf(testAddress, "test", "value")
  
  generateEvent("'value' has been set to key 'test'")

  generateEvent("random number generation " + unsafeRandom().toString())
}

export function event(): void {
  generateEvent("This is an event")
}`;

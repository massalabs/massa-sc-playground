export const Massa = `export namespace env {
      // @ts-ignore
      @external("massa", "assembly_script_print")
      export declare function print(message: string): void
  
      // @ts-ignore
      @external("massa", "assembly_script_call")
      export declare function call(
          address: string,
          func: string,
          param: string,
          coins: u64): string
  
      // @ts-ignore
      @external("massa", "assembly_script_get_remaining_gas")
      export declare function remainingGas(): u64
  
      // @ts-ignore
      @external("massa", "assembly_script_create_sc")
      export declare function createSC(bytecode: string): string
  
      // @ts-ignore
      @external("massa", "assembly_script_set_data")
      export declare function set(
          key: string,
          value: string): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_set_data_for")
      export declare function setOf(
          address: string,
          key: string,
          value: string): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_data")
      export declare function get(key: string): string;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_data_for")
      export declare function getOf(
          address: string,
          key: string): string;
  
      // @ts-ignore
      @external("massa", "assembly_script_delete_data")
      export declare function del(key: string): void
  
      // @ts-ignore
      @external("massa", "assembly_script_delete_data_for")
      export declare function deleteOf(
          address: string,
          key: string): void
  
      // @ts-ignore
      @external("massa", "assembly_script_append_data")
      export declare function append(
          key: string,
          value: string): void
  
      // @ts-ignore
      @external("massa", "assembly_script_append_data_for")
      export declare function appendOf(
          address: string,
          key: string,
          value: string): void
  
      // @ts-ignore
      @external("massa", "assembly_script_has_data")
      export declare function has(key: string): bool;
  
      // @ts-ignore
      @external("massa", "assembly_script_has_data_for")
      export declare function hasOf(
          address: string,
          key: string): bool;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_owned_addresses")
      export declare function ownedAddresses(): string;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_call_stack")
      export declare function callStack(): string;
  
      // @ts-ignore
      @external("massa", "assembly_script_generate_event")
      export declare function generateEvent(event: string): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_transfer_coins")
      export declare function transferCoins(
          to: string, amount: u64): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_transfer_coins_for")
      export declare function transferCoinsOf(
          from: string, to: string, amount: u64): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_balance")
      export declare function balance(): u64;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_balance_for")
      export declare function balanceOf(address: string): u64;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_call_coins")
      export declare function callCoins(): u64;
  
      // @ts-ignore
      @external("massa", "assembly_script_hash")
      export declare function toBase58(data: string): string;
  
      // @ts-ignore
      @external("massa", "assembly_script_signature_verify")
      export declare function isSignatureValid(
          digest: string,
          signature: string,
          publicKey: string): bool;
  
      // @ts-ignore
      @external("massa", "assembly_script_address_from_public_key")
      export declare function publicKeyToAddress(
          publicKey: string): string;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_time")
      export declare function time(): u64;
  
      // @ts-ignore
      @external("massa", "assembly_script_unsafe_random")
      export declare function unsafeRandom(): i64;
  
      // @ts-ignore
      @external("massa", "assembly_script_send_message")
      export declare function sendMessage(
          address: string, handler: string,
          validityStartPeriod: u64, validityStartThread: u8,
          validityEndPeriod: u64, validityEndThread: u8,
          maxGas: u64, gasPrice: u64, coins: u64,
          data: string): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_current_period")
      export declare function currentPeriod(): u64;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_current_thread")
      export declare function currentThread(): u8;
  
      // @ts-ignore
      @external("massa", "assembly_script_set_bytecode")
      export declare function setBytecode(bytecode: string): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_set_bytecode_for")
      export declare function setBytecodeOf(
          address: string,
          bytecode: string): void;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_op_keys")
      export declare function getOpKeys(): StaticArray<u8>;
  
      // @ts-ignore
      @external("massa", "assembly_script_has_op_key")
      export declare function hasOpKey(key: StaticArray<u8>): StaticArray<u8>;
  
      // @ts-ignore
      @external("massa", "assembly_script_get_op_data")
      export declare function getOpData(key: StaticArray<u8>): StaticArray<u8>;
  }
  
  
  export interface Valider {
      isValid(): bool;
    }
  
    /**
   * A simple array of bytes.
   */
  export class ByteArray extends Uint8Array {
      /**
       * Convert a byte string to a byte array.
       * @param {string} byteString - Byte string
       *
       * @return {ByteArray}
       */
      static fromByteString(byteString: string): ByteArray {
        const self = new ByteArray(byteString.length);
        for (let i = 0; i < self.length; i++) {
          self[i] = u8(byteString.charCodeAt(i));
        }
        return self;
      }
    
      /**
       * Returns a byte string.
       *
       * @return {string}
       */
      toByteString(): string {
        let s = '';
        for (let i = 0; i < this.length; i++) {
          s += String.fromCharCode(this[i]);
        }
        return s;
      }
    
      /**
       * Convert a uint8 Array to a byte array.
       * @param {Uint8Array} array - Uint8 array
       *
       * @return {ByteArray}
       */
      static fromUint8Array(array: Uint8Array): ByteArray {
        return changetype<ByteArray>(array);
      }
    
      /**
       * Convert a byte to a byte array.
       * @param {u8} b - byte
       *
       * @return {ByteArray}
       */
      static fromU8(b: u8): ByteArray {
        const self = new ByteArray(1);
        self[0] = b;
        return self;
      }
    
      /**
       * Returns bytes in little-endian order.
       * @param {i32} i - integer
       *
       * @return {ByteArray}
       */
      static fromI32(i: i32): ByteArray {
        const self = new ByteArray(4);
        self[0] = i as u8;
        self[1] = (i >> 8) as u8;
        self[2] = (i >> 16) as u8;
        self[3] = (i >> 24) as u8;
        return self;
      }
    
      /**
       * Returns a int32
       *
       * @return {i32}
       */
      toI32(): i32 {
        if (this.length != 4) {
          return <i32>NaN;
        }
    
        let x: i32 = 0;
        x = (x | this[3]) << 8;
        x = (x | this[2]) << 8;
        x = (x | this[1]) << 8;
        x = x | this[0];
        return x;
      }
    
      /**
       * Returns bytes in little-endian order.
       * @param {u32} u - integer
       *
       * @return {ByteArray}
       */
      static fromU32(u: u32): ByteArray {
        const self = new ByteArray(4);
        self[0] = u as u8;
        self[1] = (u >> 8) as u8;
        self[2] = (u >> 16) as u8;
        self[3] = (u >> 24) as u8;
        return self;
      }
    
      /**
       * Returns a u32 from byte array
       *
       * @return {u32}
       */
      toU32(): u32 {
        if (this.length != 4) {
          return <u32>NaN;
        }
    
        let x: u32 = 0;
        x = (x | this[3]) << 8;
        x = (x | this[2]) << 8;
        x = (x | this[1]) << 8;
        x = x | this[0];
        return x;
      }
    
      /**
       * Returns bytes in little-endian order.
       * @param {i64} i - integer
       *
       * @return {ByteArray}
       */
      static fromI64(i: i64): ByteArray {
        const self = new ByteArray(8);
        self[0] = i as u8;
        self[1] = (i >> 8) as u8;
        self[2] = (i >> 16) as u8;
        self[3] = (i >> 24) as u8;
        self[4] = (i >> 32) as u8;
        self[5] = (i >> 40) as u8;
        self[6] = (i >> 48) as u8;
        self[7] = (i >> 56) as u8;
        return self;
      }
    
      /**
       * Returns a i64.
       *
       * @return {i64}
       */
      toI64(): i64 {
        if (this.length != 8) {
          return <i64>NaN;
        }
    
        let x: i64 = 0;
        x = (x | this[7]) << 8;
        x = (x | this[6]) << 8;
        x = (x | this[5]) << 8;
        x = (x | this[4]) << 8;
        x = (x | this[3]) << 8;
        x = (x | this[2]) << 8;
        x = (x | this[1]) << 8;
        x = x | this[0];
        return x;
      }
    
      /**
       * Returns bytes in little-endian order.
       * @param {u64} u - integer
       *
       * @return {ByteArray}
       */
      static fromU64(u: u64): ByteArray {
        const self = new ByteArray(8);
        self[0] = u as u8;
        self[1] = (u >> 8) as u8;
        self[2] = (u >> 16) as u8;
        self[3] = (u >> 24) as u8;
        self[4] = (u >> 32) as u8;
        self[5] = (u >> 40) as u8;
        self[6] = (u >> 48) as u8;
        self[7] = (u >> 56) as u8;
        return self;
      }
    
      /**
       * Returns a u64.
       *
       * @return {u64}
       */
      toU64(): u64 {
        if (this.length != 8) {
          return <u64>NaN;
        }
        let x: u64 = 0;
        x = (x | this[7]) << 8;
        x = (x | this[6]) << 8;
        x = (x | this[5]) << 8;
        x = (x | this[4]) << 8;
        x = (x | this[3]) << 8;
        x = (x | this[2]) << 8;
        x = (x | this[1]) << 8;
        x = x | this[0];
        return x;
      }
    
      /**
       * Returns a new byte array from the concatenation of the values
       * of the two byte arrays.
       *
       * @param {ByteArray} ba
       * @return {ByteArray}
       */
      concat(ba: ByteArray): ByteArray {
        const n = new ByteArray(this.length + ba.length);
        n.set(this, 0);
        n.set(ba, this.length);
        return n;
      }
    
      /**
       * Tests if two ByteArray have identical bytes.
       *
       * @param {ByteArray} other
       * @return {boolean}
       */
      @operator('==')
      equals(other: ByteArray): boolean {
        if (this.length != other.length) {
          return false;
        }
        for (let i = 0; i < this.length; i++) {
          if (this[i] != other[i]) {
            return false;
          }
        }
        return true;
      }
    
      /**
       * Tests if two ByteArray have different bytes.
       *
       * @param {ByteArray} other
       * @return {boolean}
       */
      @operator('!=')
      notEqual(other: ByteArray): boolean {
        return !(this == other);
      }
    }
  
    export class Address implements Valider {
    _value: string;
    _isValid: bool;
  
    /**
       * Creates a new Address;
       *
       * @param {string} bs - Byte string.
       * @param {bool} isValid - default true
       */
    constructor(bs: string = '', isValid: bool = true) {
      this._value = bs;
      this._isValid = isValid;
    }
  
    /**
       * Returns if the Address is still valid.
       *
       * see https://github.com/massalabs/massa-sc-runtime/issues/142
       *
       * @return {bool}
       */
    isValid(): bool {
      return this._isValid;
    }
  
    /**
       * Returns the offset of the next element after having parsed
       * an address from a string segment.
       *
       * The string segment can contains more thant on serialized element.
       *
       * @param {string} bs
       * @param {i32} begin
       * @return {i32}
       */
    fromStringSegment(bs: string, begin: i32 = 0): i32 {
      const length = u8(bs.codePointAt(begin));
      // return length;
      this._value = Address.fromByteString(
        bs.slice(begin + 1, begin + length + 1),
      ).toByteString();
      return begin + length + 1;
    }
  
    /**
       * Returns a string segment.
       *
       * The string segment can be concatenated with others
       * to serialize multiple elements.
       *
       * @return {string}
       */
    toStringSegment(): string {
      return String.fromCharCode(u8(this._value.length)).concat(
        this.toByteString(),
      );
    }
  
    /**
       * Returns an Address from a byte string.
       *
       * @param {string} bs - Byte string
       *
       * @return {Address}
       */
    static fromByteString(bs: string): Address {
      return new Address(bs);
    }
  
    /**
       * Serialize to byte string.
       *
       * @return {string}
       */
    toByteString(): string {
      return this._value;
    }
  
    /**
       * Returns an Address from a byte array.
       *
       * @param {string} a - Byte array
       *
       * @return {Address}
       */
    static fromByteArray(a: Uint8Array): Address {
      return this.fromByteString(ByteArray.fromUint8Array(a).toByteString());
    }
  
    /**
       * Serialize to ByteArray.
       * @return {ByteArray}
       */
    toByteArray(): ByteArray {
      return ByteArray.fromByteString(this._value);
    }
  
    /**
     * Tests if two adresses are identical.
     *
     * @param {Address} other
     * @return {boolean}
     */
    @operator('==')
    equals(other: Address): boolean {
      return this._value == other.toByteString();
    }
  
    /**
     * Tests if two addresses are different.
     *
     * @param {Address} other
     * @return {boolean}
     */
    @operator('!=')
    notEqual(other: Address): boolean {
      return !(this == other);
    }
  }
  
  
  
  
  /**
   * Sets (key, value) in the datastore of the callee's address.
   *
   * Note: Existing entries are overwritten and missing ones are created.
   *
   * @param {string} key
   * @param {string} value
   */
  export function set(key: string, value: string): void {
    env.set(key, value);
  }
  
  /**
   * Sets (key, value) in the datastore of the given address.
   * Existing entries are overwritten and missing ones are created.
   *
   * TODO: explains security mecanisms
   *
   * @param {Address} address
   * @param {string} key
   * @param {string} value
   */
  export function setOf(address: Address, key: string, value: string): void {
    env.setOf(address.toByteString(), key, value);
  }
  
  /**
   * Returns (key, value) in the datastore of the callee's address.
   *
   * TODO: explains what happens on missing key.
   *
   * @param {string} key
   *
   * @return {string}
   */
  export function get(key: string): string {
    return env.get(key);
  }
  
  /**
   * Returns (key, value) in the datastore of the given address.
   *
   * TODO: explains what happens on missing key.
   *
   * @param {Address} address
   * @param {string} key
   *
   * @return {string}
   */
  export function getOf(address: Address, key: string): string {
    return env.getOf(address.toByteString(), key);
  }
  
  /**
   * Removes (key, value) from the datastore of the callee's address.
   *
   * TODO: explains what happens on missing key.
   * TODO: explains security mecanisms
   *
   * @param {string} key
   */
  export function del(key: string): void {
    env.del(key);
  }
  
  /**
   * Removes (key, value) from the datastore of the given address.
   *
   * TODO: explains what happens on missing key.
   * TODO: explains security mecanisms
   *
   * @param {Address} address
   * @param {string} key
   */
  export function deleteOf(address: Address, key: string): void {
    env.deleteOf(address.toByteString(), key);
  }
  
  /**
   * Appends value to existing data of the (key, value) in
   * the datastore of the callee's address.
   *
   * Note: do nothing if key is absent.
   *
   * @param {string} key
   * @param {string} value
   */
  export function append(key: string, value: string): void {
    env.append(key, value);
  }
  
  /**
   * Appends value to existing data of the (key, value) in
   * the datastore of the given address.
   *
   * Note: do nothing if key is absent.
   * TODO: explains security mecanisms
   *
   * @param {Address} address target address
   * @param {string} key key string
   * @param {string} value value to append
   */
  export function appendOf(
    address: Address,
    key: string,
    value: string,
  ): void {
    env.appendOf(address.toByteString(), key, value);
  }
  
  /**
   * Checks if the (key, value) exists in the datastore
   * of the callee's address.
   *
   * @param {string} key
   * @return {bool}
   */
  export function has(key: string): bool {
    return env.has(key);
  }
  
  /**
   * Checks if the (key, value) exists in the datastore
   * of the given address.
   *
   * @param {Address} address
   * @param {string} key
   *
   * @return {bool}
   */
  export function hasOf(address: Address, key: string): bool {
    return env.hasOf(address.toByteString(), key);
  }
  
  /**
   *  Sets the executable bytecode of the callee's address.
   *
   * TODO: explains failure consequences.
   *
   * @param {string} bytecode base64-encoded
   */
  export function setBytecode(bytecode: string): void {
    env.setBytecode(bytecode);
  }
  
  /**
   *  Sets the executable bytecode of the given address.
   *
   * TODO: explains security mecanisms.
   *
   * @param {Address} address target address
   * @param {string} bytecode base64-encoded
   */
  export function setBytecodeOf(address: Address, bytecode: string): void {
    env.setBytecodeOf(address.toByteString(), bytecode);
  }
  
  export const _KEY_ELEMENT_SUFFIX = '::';
  
  /**
   * Returns an array of addresses.
   *
   * @param {string} str - json encode
   *
   * @return {Array<Address>}
   */
  function json2Address(str: string): Array<Address> {
      str = str.substr(1, str.length - 2);
  
      const a = str.split(',');
      return a.map<Address>((x) =>
          Address.fromByteString(x.substring(1, x.length - 1))
      );
  }
  
  /**
   * Returns owned addresses.
   *
   * TODO:
   * - explain function purpose
   * - explain format
   *
   * @return {Array<Address>}
   */
  export function ownedAddresses(): Array<Address> {
      return json2Address(env.ownedAddresses());
  }
  
  /**
   * Returns stack addresses.
   *
   * The address stack is the list of the called modules' address.
   * You get all previously called since the address of
   * the originator (transaction creator).
   *
   * @return {Array<Address>}
   */
  export function addressStack(): Array<Address> {
      return json2Address(env.callStack());
  }
  
  /**
   * Returns caller's address.
   *
   * Caller is the person or the smart contract that directly called
   * the pending function.
   *
   * @return {Address}
   */
  export function caller(): Address {
      const a = addressStack();
      return a.length < 2 ? new Address('', false) : a[a.length - 2];
  }
  
  /**
   * Returns callee's address.
   *
   * Callee is the smart contract of the pending function.
   *
   * @return {Address}
   */
  export function callee(): Address {
      const a = addressStack();
      return a[a.length - 1];
  }
  
  /**
   * Return the address of the initial transaction creator (originator).
   *
   * @return {Address}
   */
  export function transactionCreator(): Address {
      return addressStack()[0];
  }
  
  /**
   * Returns the amount transferred in the current call.
   *
   * @return {u64} - value in the smallest unit.
   */
  export function transferedCoins(): u64 {
      return env.callCoins();
  }
  
  /**
   * Returns the slot unix timestamp in milliseconds
   *
   * @return {u64}
   */
  export function timestamp(): u64 {
      return env.time();
  }
  
  /**
   * Returns the remaining gas.
   * @return {u64}
   */
  export function remainingGas(): u64 {
      return env.remainingGas();
  }
  
  
  
  
  
  
  /**
   * Prints in the node logs
   *
   * @param {string} message Message string
   */
  export function print(message: string): void {
    env.print(message);
  }
  
  /**
   * Calls a remote function located at given address.
   *
   * Note: arguments serialization is to be handled by the caller and the callee.
   *
   * @param {Address} at
   * @param {string} functionName
   * @param {string} args
   * @param {u64} coins // TODO define usage
   *
   * @return {string} function returned value (serialized)
   */
  export function call(
    at: Address,
    functionName: string,
    args: string,
    coins: u64,
  ): string {
    return env.call(at.toByteString(), functionName, args, coins);
  }
  
  /**
   * Creates a new smart contract.
   *
   * Take a base64 string representing the module binary and create an entry in
   * the ledger.
   *
   * The context allow you to write in this smart contract while you're executing
   * the current bytecode.
   *
   * @param {string} bytecode - base64 encoded
   *
   * @return {string} Smart contract address
   */
  export function createSC(bytecode: string): Address {
    return Address.fromByteString(env.createSC(bytecode));
  }
  
  /**
   * Generates an event
   *
   * @param {string} event - stringified
   */
  export function generateEvent(event: string): void {
    env.generateEvent(event);
  }
  
  /**
   * Transfers SCE coins from the current address to given address.
   *
   * @param {Address} to
   * @param {u64} amount - value in the smallest unit.
   */
  export function transferCoins(to: Address, amount: u64): void {
    env.transferCoins(to.toByteString(), amount);
  }
  
  /**
   * Transfers SCE coins of the \`from\` address to the \`to\` address.
   *
   * @param {Address} from
   * @param {Address} to
   * @param {u64} amount - value in the smallest unit.
   */
  export function transferCoinsOf(from: Address, to: Address, amount: u64): void {
    env.transferCoinsOf(from.toByteString(), to.toByteString(), amount);
  }
  
  /**
   * Gets the balance of the current address
   *
   * @return {u64} - value in the smallest unit.
   */
  export function balance(): u64 {
    return env.balance();
  }
  
  /**
   * Gets the balance of the specified address.
   *
   * @param {string} address
   *
   * @return {u64} - value in the smallest unit.
   */
  export function balanceOf(address: string): u64 {
    return env.balanceOf(address);
  }
  
  /**
   * Check for key in datastore
   *
   * @param {StaticArray<u8>} key
   *
   * @return {bool} - true if key is present in datastore, false otherwise.
   */
  export function hasOpKey(key: StaticArray<u8>): bool {
    let result = env.hasOpKey(key);
    // From https://doc.rust-lang.org/reference/types/boolean.html &&
    // https://www.assemblyscript.org/types.html
    // we can safely cast from u8 to bool
    return bool(result[0]);
  }
  
  /*
   * Get data associated with the given key from datastore
   *
   * @param {StaticArray<u8>} key
   *
   * @return {StaticArray<u8>} - data as a byte array
   */
  export function getOpData(key: StaticArray<u8>): StaticArray<u8> {
    return env.getOpData(key);
  }
  
  /*
   * Get all keys from datastore
   *
   * @return {StaticArray<u8>} - a list of key (e.g. a list of bytearray)
   */
  export function getOpKeys(): Array<StaticArray<u8>> {
    let keys_ser = env.getOpKeys();
    return derOpKeys(keys_ser);
  }
  
  /*
   * Internal function - used by getOpKeys
   */
  export function derOpKeys(keys_ser: StaticArray<u8>): Array<StaticArray<u8>> {
  
    if (keys_ser.length == 0) {
      return new Array<StaticArray<u8>>();
    }
  
    // Datastore deserialization
    // Format is: L (u32); V1_L (u8); V1 data (u8*V1_L); ...
    // u8 * 4 (LE) => u32
    let ar = new Uint8Array(4);
    ar[0] = keys_ser[0];
    ar[1] = keys_ser[1];
    ar[2] = keys_ser[2];
    ar[3] = keys_ser[3];
    let dv = new DataView(ar.buffer, ar.byteOffset, ar.byteLength);
    let entry_count = dv.getUint32(0, true /* littleEndian */);
  
    let cursor = 4;
    let keys_der = new Array<StaticArray<u8>>(entry_count);
    for (let i: u32 = 0; i < entry_count; i++) {
      let end = cursor + keys_ser[cursor] + 1;
      keys_der[i] = StaticArray.slice(keys_ser, cursor +1, end);
  
      cursor = end;
    }
  
    return keys_der;
  }
  
  /**
   * Converts data to base58.
   *
   * @param {string} data
   *
   * @return {string}
   */
  export function toBase58(data: string): string {
    return env.toBase58(data);
  }
  
  /**
   * Tests if the signature is valid.
   *
   * @param {string} publicKey - base58check encoded
   * @param {string} digest
   * @param {string} signature - base58check encoded
  
   * @return {bool}
   */
  export function isSignatureValid(
    publicKey: string,
    digest: string,
    signature: string,
  ): bool {
    return env.isSignatureValid(digest, signature, publicKey);
  }
  
  /**
   * Converts a public key to an address
   *
   * @param {string} pubKey -  Base58check endoded
   *
   * @return {Address}
   */
  export function publicKeyToAddress(pubKey: string): Address {
    return Address.fromByteString(env.publicKeyToAddress(pubKey));
  }
  
  /**
   * Returns an unsafe random.
   *
   * /!\ This function is unsafe because the random draws is predictable.
   *
   * @return {i64}
   */
  export function unsafeRandom(): i64 {
    return env.unsafeRandom();
  }
  
  /**
   * Sends an async message to a function at given address.
   *
   * Note: serialization is to be handled at the caller and the callee level.
   *
   * @param {string} at
   * @param {string} functionName
   * @param {u64} validityStartPeriod - Period of the validity start slot
   * @param {u8} validityStartThread - Thread of the validity start slot
   * @param {u64} validityEndPeriod - Period of the validity end slot
   * @param {u8} validityEndThread - Thread of the validity end slot
   * @param {u64} maxGas - Maximum gas for the message execution
   * @param {u64} gasPrice - Price of one gas unit
   * @param {u64} coins - Coins of the sender
   * @param {string} msg - serialized data
   */
  export function sendMessage(
    at: Address,
    functionName: string,
    validityStartPeriod: u64,
    validityStartThread: u8,
    validityEndPeriod: u64,
    validityEndThread: u8,
    maxGas: u64,
    gasPrice: u64,
    coins: u64,
    msg: string,
  ): void {
    env.sendMessage(
      at.toByteString(),
      functionName,
      validityStartPeriod,
      validityStartThread,
      validityEndPeriod,
      validityEndThread,
      maxGas,
      gasPrice,
      coins,
      msg,
    );
  }
  
  /**
   * Convert given file content to base64.
   *
   * Note: this function shall never be called but is dynamically
   * replace using base64 transformer.
   * More info here:
   *
   * @param {string} filePath
   *
   * @return {string}
   */
  export function fileToBase64(
    filePath: string, // eslint-disable-line @typescript-eslint/no-unused-vars
  ): string {
    abort('Please use base64 transformer to dynamically include the file.');
    return '';
  }
  
  /**
   * Returns the current period
   * @return {u8}
   */
  export function currentPeriod(): u64 {
    return env.currentPeriod();
  }
  
  /**
   * Returns the current thread
   * @return {u8}
   */
  export function currentThread(): u8 {
    return env.currentThread();
  }`;

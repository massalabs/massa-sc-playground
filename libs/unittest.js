export const Envy = ` 

      @external("env", "log")
      export declare function log(message: ArrayBuffer): void
    
      // / <reference path="./global.d.ts" />
      export function _startTests(): u32 {
        root.evaluate(new TestNodeReporterContext());
        return 1;
      }
      
      class TestNodeReporterContext {
        indent: i32 = 0;
      }
        
      function write(str: string): void {
        log(String.UTF16.encode(str));
      }
      
      class TestNode {
        group: bool = false;
        children: TestNode[] = [];
        success: bool = false;
        constructor(
          public name: string,
          public callback: () => void,
        ) { }
      
        evaluate(ctx: TestNodeReporterContext): void {
          if (this != root) {
            ctx.indent += 2;
            if (this.group) {
              write(' '.repeat(ctx.indent) + 'Group: ' + this.name )
            };
            else {
              write(' '.repeat(ctx.indent) + 'Test: ' + this.name )
            };
          }
      
          const parent = current;
          current = this;
          this.callback();
      
          // once the test is run, children are determined, evaluate them
          const children = this.children;
          const childrenLength = children.length;
          for (let i = 0; i < childrenLength; i++) {
            const child = unchecked(children[i]);
            child.evaluate(ctx);
          }
      
          current = parent;
          if (this != root) {
            ctx.indent -= 2;
          }
        }
      }
      
      const root: TestNode = new TestNode('Root', () => { });
      let current: TestNode = root;
      
      @global  function test(name: string, callback: () => void): void {
        const t = new TestNode(name, callback);
        current.children.push(t);
      }
      
      @global function error(message:string): void {
        // const stdout = wasi_process.stderr;
        write("Error: " + message);
      }
      
      @global function describe(name: string, callback: () => void): void {
        const t = new TestNode(name, callback);
        t.group = true;
        current.children.push(t);
      }



      `;

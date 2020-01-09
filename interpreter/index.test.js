const Interpreter = require('./index');
const Trie = require('../store/trie');
const {
    STOP,
    ADD,
    SUB,
    MUL,
    DIV,
    PUSH,
    LT,
    GT,
    EQ,
    AND,
    OR,
    JUMP,
    JUMPI,
    STORE,
    LOAD
  } = Interpreter.OPCODE_MAP;

  describe('Interpreter', () => {
      describe('runCode()', () => {
        describe('and the code includes ADD', () => {
            it('adds two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, ADD, STOP]).result
                ).toEqual(5);
            });
        });

        describe('and the code includes SUB', () => {
            it('subtracts two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, SUB, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes MUL', () => {
            it('multiplies two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, MUL, STOP]).result
                ).toEqual(6);
            });
        });

        describe('and the code includes DIV', () => {
            it('divides two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, DIV, STOP]).result
                ).toEqual(1.5);
            });
        });

        describe('and the code includes LT', () => {
            it('checks if one value is less than another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, LT, STOP]).result
                ).toEqual(0);
            });
        });

        describe('and the code includes GT', () => {
            it('checks if one value is greather than another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, GT, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes EQ', () => {
            it('if one value is equal to another', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, EQ, STOP]).result
                ).toEqual(0);
            });
        });

        describe('and the code includes AND', () => {
            it('ands two conditions', () => {
                expect(
                    new Interpreter().runCode([PUSH, 1, PUSH, 0, AND, STOP]).result
                ).toEqual(0);
            });
        });

        describe('and the code includes OR', () => {
            it('ors two conditions', () => {
                expect(
                    new Interpreter().runCode([PUSH, 1, PUSH, 0, OR, STOP]).result
                ).toEqual(1);
            });
        });

        describe('and the code includes JUMP', () => {
            it('jumps to a destination', () => {
                expect(
                    new Interpreter().runCode(
                        [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'jump successful', STOP]).result
                ).toEqual('jump successful');
            });
        });

        describe('and the code includes JUMPI', () => {
            it('jumps to a destination', () => {
                expect(
                    new Interpreter().runCode(
                        [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, 'jump successful', STOP]).result
                ).toEqual('jump successful');
            });
        });

        describe('and the code includes STORE', () => {
            it('stores a value', () => {
                const interpreter = new Interpreter({
                    storageTrie: new Trie()
                });
                const key = 'foo';
                const value = 'bar';

                interpreter.runCode([PUSH, value, PUSH, key, STORE, STOP]);

                expect(interpreter.storageTrie.get({ key })).toEqual(value);
            });
        });

        describe('and the code includes LOAD', () => {
            it('loads a value', () => {
                const interpreter = new Interpreter({
                    storageTrie: new Trie()
                });
                const key = 'foo';
                const value = 'bar';

                expect(
                    interpreter.runCode(
                        [PUSH, value, PUSH, key, STORE, PUSH, key, LOAD, STOP]
                    ).result
                ).toEqual(value);
            });
        });

        describe('and the code includes an invalid JUMP destination', () => {
            it('throws an error', () => {
                expect(
                    () => new Interpreter().runCode(
                        [PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, 'jump successful', STOP])
                ).toThrow('Invalid destination: 99');
            });
        });

        describe('and the code includes an invalid PUSH value', () => {
            it('throws an error', () => {
                expect(
                    () => new Interpreter().runCode([PUSH, 0, PUSH])
                ).toThrow("The 'PUSH' instruction cannot be last.");
            });
        });

        describe('and the code includes an infinite loop', () => {
            it('throws an error', () => {
                expect(
                    () => new Interpreter().runCode([PUSH, 0, JUMP, STOP])
                ).toThrow('Check for an infinite loop. Execution limit of 10000 exceeded');
            });
        });
      });
  });
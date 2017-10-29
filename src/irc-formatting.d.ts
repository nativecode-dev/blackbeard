declare module 'irc-formatting' {
  export class Block {
    public static EMPTY: Block
    constructor(prev?: string, text?: string)
    public equals(other: Block): boolean
    public getColorString(): string
    public hasSameColor(other: Block, reversed: boolean): boolean
    public isPlain(): boolean
  }
  export function compress(blocks: Block[]): Block[]
  export function renderHtml(blocks: Block[]): string
  export function renderIrc(blocks: Block[]): string
  export function parse(text: string): Block
  export function removeColor(blocks: Block[]): Block[]
  export function removeStyle(blocks: Block[]): Block[]
  export function strip(blocks: string | Block[]): string
  export function swigFilter(blocks: Block[]): string
  export function swigInLine(blocks: Block[]): string
}

export type ABI = Array<{
  name: string;
  type: string;
  inputs: Array<Record<string, any> | string>;
  outputs: Array<Record<string, any> | string>;
}>;

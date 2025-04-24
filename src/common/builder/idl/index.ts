import { IDL as IDL } from '@dfinity/candid';

import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';

import type { ABI } from './@types/ABI';

const types: Record<string, IDL.Type> = {
  text: IDL.Text,
  bool: IDL.Bool,
  int: IDL.Int,
  nat: IDL.Nat,
  null: IDL.Null,
  float64: IDL.Float64,
};

export class IdlBuilder {
  static parseType(def: string | Record<string, string>) {
    if (isString(def)) {
      const type = types[def.toLowerCase()];

      if (!type) {
        throw new Error(`Primitive type not supported: ${def}`);
      }

      return type;
    }

    if (isPlainObject(def)) {
      const fields: Record<string, IDL.Type> = {};

      for (const [key, type] of Object.entries(def)) {
        fields[key] = IdlBuilder.parseType(type);
      }

      return IDL.Record(fields);
    }

    throw new Error(`Tipo não suportado: ${JSON.stringify(def)}`);
  }

  static run(abi: ABI) {
    if (!isArray(abi)) {
      throw new Error('Invalid ABI format.');
    }

    const serviceDef: Record<string, any> = {};

    for (const method of abi) {
      const methodName = method.name;
      const inputs = method.inputs.map(IdlBuilder.parseType);
      const outputs = method.outputs.map(IdlBuilder.parseType);

      serviceDef[methodName] = IDL.Func(inputs, outputs, []);
    }

    return ({ IDL: { Service } }: any) => {
      return Service(serviceDef);
    };
  }
}

import { IDL } from '../../config/idl';
import type { ABI } from '../../builder/idl/@types/ABI';

export class IDLProvider {
  static concat(abi: ABI) {
    return [...IDL.auth, ...abi];
  }
}

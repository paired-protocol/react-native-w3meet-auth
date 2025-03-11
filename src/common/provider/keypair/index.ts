import { toHex } from '@dfinity/agent';

import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
  type JsonnableDelegationChain,
} from '@dfinity/identity';

export class KeypairProvider {
  static create() {
    const base = Ed25519KeyIdentity.generate();
    const pubkey = toHex(base.getPublicKey().toDer());

    return { pubkey, base };
  }

  static getDelegationIdentity(
    key: Ed25519KeyIdentity,
    delegationChain: JsonnableDelegationChain
  ) {
    const chain = DelegationChain.fromJSON(delegationChain);

    if (!isDelegationValid(chain)) {
      throw new Error('Invalid  delegation chain');
    }

    return DelegationIdentity.fromDelegation(key, chain);
  }
}

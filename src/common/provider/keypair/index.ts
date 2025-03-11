import { toHex } from '@dfinity/agent';

import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
  type JsonnableDelegationChain,
} from '@dfinity/identity';

import type { TPasskey, TPubKeys } from '../../../types';

export class KeypairProvider {
  private static pubkeys: TPubKeys = {};

  static create(user: TPasskey['user']) {
    const currentPubkey = KeypairProvider.pubkeys[user.id];

    if (currentPubkey) {
      return currentPubkey;
    }

    const base = Ed25519KeyIdentity.generate();
    const pubkey = toHex(base.getPublicKey().toDer());

    KeypairProvider.pubkeys[user.id] = {
      base,
      pubkey,
    };

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

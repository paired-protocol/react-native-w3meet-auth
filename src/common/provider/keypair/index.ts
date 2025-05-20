import { toHex } from '@dfinity/agent';

import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
} from '@dfinity/identity';

import type { TPasskey, TPubKeys } from '../../types';

export class KeypairProvider {
  private static pubkeys: TPubKeys = {};

  static create(user: TPasskey['user']) {
    const currentPubkey = KeypairProvider.pubkeys[user.id];

    console.log({ currentPubkey });

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

  static getDelegationIdentity(key: Ed25519KeyIdentity, json: string) {
    const chain = DelegationChain.fromJSON(json);

    if (!isDelegationValid(chain)) {
      throw new Error('Invalid  delegation chain');
    }

    return DelegationIdentity.fromDelegation(key, chain);
  }
}

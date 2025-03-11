import { Actor, HttpAgent } from '@dfinity/agent';

import { idlFactory } from './idlFactory';

import { PasskeyProvider } from './provider/passkey';
import { KeypairProvider } from './provider/keypair';

import type { TAuthenticatorProps, TActor, TPasskey } from '../types';

export class Authenticator {
  protected actor: TActor | null = null;
  protected passkey: TPasskey | null = null;

  constructor(actor: TActor, passkey: TPasskey) {
    this.actor = actor;
    this.passkey = passkey;
  }

  static config(props: TAuthenticatorProps) {
    const agent = new HttpAgent({
      host: props.host,
      fetchOptions: {
        reactNative: {
          __nativeResponseType: 'base64',
        },
      },
      verifyQuerySignatures: true,
      callOptions: {
        reactNative: {
          textStreaming: true,
        },
      },
    });

    agent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running'
      );
      console.error(err);
    });

    const actor: TActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: props.canisterId,
    });

    return new Authenticator(actor, props.passkey);
  }

  async signIn() {
    if (!this.passkey) {
      throw new Error('Invalid passkey data');
    }

    if (!this.actor) {
      throw new Error('Invalid actor');
    }

    const challenge = await this.actor.authRegisterPasskey(this.passkey.user);

    if (!challenge) {
      throw new Error('Error when trying to capture challenge');
    }

    try {
      const passkey = await PasskeyProvider.create(challenge, this.passkey);

      const payload = {
        id: passkey.id,
        rawId: passkey.rawId,
        response: {
          attestationObject: passkey.response.attestationObject,
          clientDataJSON: passkey.response.clientDataJSON,
        },
      };

      const { pubkey, base } = KeypairProvider.create(this.passkey.user);

      const { error, data } = await this.actor.authValidatePasskey(
        pubkey,
        this.passkey.user,
        payload
      );

      if (error || !data?.delegation.pubkey) {
        throw new Error(error);
      }

      const delegationChain = {
        delegations: [
          {
            delegation: data.delegation,
            signature: data.signature,
          },
        ],
        publicKey: pubkey,
      };

      const identity = KeypairProvider.getDelegationIdentity(
        base,
        delegationChain
      );

      console.log('getDelegation', identity.getDelegation());
      console.log('getPrincipal', identity.getPrincipal().toString());
      console.log('getPublicKey', identity.getPublicKey().toDer());
    } catch (error) {
      console.log('Error to validate passkey', error);
    }
  }
}

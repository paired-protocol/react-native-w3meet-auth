import { Actor, HttpAgent } from '@dfinity/agent';

import { idlFactory } from './idlFactory';
import { PasskeyProvider } from './provider/passkey';

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
    const challenge = await this.actor?.authGenerateChallenge();

    if (!challenge) {
      throw new Error('Error when trying to capture challenge');
    }

    if (!this.passkey) {
      throw new Error('Invalid passkey data');
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

      const validated = await this.actor?.authValidatePasskey(payload);

      console.log({ validated });
    } catch (error) {
      console.log('Error to validate passkey', error);
    }
  }
}

import type * as Types from '../../types';

import { KeypairProvider } from '../keypair';
import { PasskeyProvider } from '../passkey';

export class IteratorProvider {
  constructor(
    protected actor: Types.TActor,
    protected configurator: Types.TConfiguratorProps,
    protected properties: Types.TAuthenticatorProps
  ) {
    if (!configurator.passkey) {
      throw new Error('Invalid passkey data');
    }

    if (!actor) {
      throw new Error('Invalid actor');
    }

    this.actor = actor;
    this.configurator = configurator;
    this.properties = properties;
  }

  async authenticate() {
    const challenge = await this.actor.authRegisterPasskey(
      this.configurator.passkey.user
    );

    if (!challenge) {
      throw new Error('Error when trying to generate challenge.');
    }

    try {
      const passkey = await PasskeyProvider.create(
        challenge,
        this.configurator.passkey
      );

      const payload = {
        id: passkey.id,
        rawId: passkey.rawId,
        response: {
          attestationObject: passkey.response.attestationObject,
          clientDataJSON: passkey.response.clientDataJSON,
        },
      };

      const { pubkey, base } = KeypairProvider.create(
        this.configurator.passkey.user
      );

      const { error, data } = await this.actor.authValidatePasskey(
        pubkey,
        this.configurator.passkey.user,
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

      return identity;
    } catch (error) {
      console.log('Error to validate passkey', error);

      throw new Error('Error to validate passkey');
    }
  }

  authentitate() {
    console.log({ actor: this.actor });
  }
}

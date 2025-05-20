import { Actor } from '@dfinity/agent';

import type * as Types from '../../types';

import { AgentProvider } from '../agent';
import { KeypairProvider } from '../keypair';
import { PasskeyProvider } from '../passkey';
import { IDLProvider } from '../idl';
import { IdlBuilder } from '../../builder/idl';

import isEqual from 'lodash/isEqual';

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

      if (!data || error) {
        throw new Error('Error to get delegation chain');
      }

      const identity = KeypairProvider.getDelegationIdentity(base, data);

      const agent = AgentProvider.create(this.properties.host, identity);
      const abi = IDLProvider.concat(this.configurator.abi);

      const factory = IdlBuilder.run(abi);

      const actor: any = Actor.createActor(factory, {
        agent,
        canisterId: this.properties.canisterId,
      });

      return { identity, actor };
    } catch (error) {
      console.log('Error to validate passkey', error);

      throw new Error('Error to validate passkey');
    }
  }

  call(method: string, ...args: any): Promise<any> {
    if (!this.actor) {
      throw new Error('No actor found');
    }

    const actorMethod = this.actor[method];

    if (!actorMethod || !isEqual(typeof actorMethod, 'function')) {
      throw new Error(`Method ${method} not found on actor`);
    }

    return actorMethod(...args);
  }
}

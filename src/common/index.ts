import { Actor, HttpAgent } from '@dfinity/agent';

import isString from 'lodash/isString';

import { IDLProvider } from './provider/idl';
import { AgentProvider } from './provider/agent';
import { IteratorProvider } from './provider/iterator';

import type * as Types from './types';

import { IdlBuilder } from './builder/idl';

export class Connection {
  protected agent: HttpAgent | null = null;
  protected actor: Types.TActor | null = null;
  protected passkey: Types.TPasskey | null = null;
  protected properties: Types.TAuthenticatorProps | null = null;

  constructor(agent: HttpAgent, properties: Types.TAuthenticatorProps) {
    this.agent = agent;
    this.properties = properties;
  }

  static create(props: Types.TAuthenticatorProps) {
    const agent = AgentProvider.create(props.host);

    if (!isString(props.canisterId)) {
      throw new Error('Invalid canister id.');
    }

    return new Connection(agent, props);
  }

  config(configurator: Types.TConfiguratorProps) {
    const abi = IDLProvider.concat(configurator.abi);
    const factory = IdlBuilder.run(abi);

    if (!this.agent || !this.properties?.canisterId) {
      throw new Error('No agent or canister id found.');
    }

    try {
      const actor: Types.TActor = Actor.createActor(factory, {
        agent: this.agent,
        canisterId: this.properties.canisterId,
      });

      this.actor = actor;
    } catch (error) {
      throw new Error('Unexpected error connecting to canister.');
    }

    return new IteratorProvider(this.actor, configurator, this.properties);
  }
}

import { Actor } from '@dfinity/agent';
import type { DelegationIdentity } from '@dfinity/identity';

import { AgentProvider } from '../agent';
import { IDLBuilder } from '../../builder/idl';

import isEqual from 'lodash/isEqual';

export class AttachmentProvider {
  protected canister: Canister;
  protected actor: CanisterAttachActor;
  protected identity?: DelegationIdentity;

  constructor(canister: Canister, abi: ABI, identity?: DelegationIdentity) {
    this.identity = identity;
    this.canister = canister;

    if (!this.canister || !this.canister.id || !this.canister.host) {
      throw new Error('Canister attached not initialized properly.');
    }

    const agent = AgentProvider.create(canister.host, identity);
    const idl = IDLBuilder.run(abi);

    this.actor = Actor.createActor(idl, {
      agent,
      canisterId: canister.id,
    });
  }

  call(method: string, ...args: any): Promise<any> {
    if (!this.actor) {
      throw new Error(`No actors found from the canister: ${this.canister.id}`);
    }

    const actorMethod = this.actor[method];

    if (!actorMethod || !isEqual(typeof actorMethod, 'function')) {
      throw new Error(`Method ${method} not found on actor`);
    }

    return actorMethod(...args);
  }
}

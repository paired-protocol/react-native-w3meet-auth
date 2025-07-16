import { Actor, HttpAgent } from '@dfinity/agent';
import { IDLBuilder } from './builder/idl';
import { AgentProvider } from './provider/agent';
import { IDLProvider } from './provider/idl';
import { PasskeyProvider } from './provider/passkey';
import { KeypairProvider } from './provider/keypair';
import type { DelegationIdentity } from '@dfinity/identity';
import { AttachmentProvider } from './provider/attachment';

export class CanisterAuthConnector {
  protected canister: Canister;
  protected agent: HttpAgent;
  protected identity?: DelegationIdentity;

  constructor(props: CanisterAuthConnectorProps) {
    this.canister = props.canister;

    if (!this.canister || !this.canister.id || !this.canister.host) {
      throw new Error('Canister not initialized properly.');
    }

    this.agent = AgentProvider.create(props.canister.host);

    if (!this.agent) {
      throw new Error('Invalid agent.');
    }
  }

  getIdentity() {
    return this.identity;
  }

  async invoke(props: CanisterAuthInvokeProps) {
    if (!props.passkey) {
      throw new Error('Invalid passkey data.');
    }

    const idl = IDLBuilder.run(IDLProvider.join(props.abi));

    try {
      const actor: CanisterAuthConnectorActor = Actor.createActor(idl, {
        agent: this.agent,
        canisterId: this.canister.id,
      });

      const challenge = await actor.authRegisterPasskey(props.passkey.user);

      if (!challenge) {
        throw new Error('Error when trying to generate challenge.');
      }

      const passkey = await PasskeyProvider.create(challenge, props.passkey);

      const payload = {
        id: passkey.id,
        rawId: passkey.rawId,
        response: {
          attestationObject: passkey.response.attestationObject,
          clientDataJSON: passkey.response.clientDataJSON,
        },
      };

      const { pubkey, base } = KeypairProvider.create(props.passkey.user);

      const { error, data } = await actor.authValidatePasskey(
        pubkey,
        props.passkey.user,
        payload
      );

      if (!data || error) {
        throw new Error('Error to get delegation chain.');
      }

      this.identity = KeypairProvider.getDelegationIdentity(base, data);
    } catch (error: any) {
      throw new Error(
        error?.message || 'Unexpected error connecting to canister.'
      );
    }
  }

  attachCanister(props: CanisterAttachProps) {
    if (props.useAuthentication && !this.identity) {
      throw new Error('Authentication is required to attach the canister.');
    }

    return new AttachmentProvider(
      {
        id: props.id,
        host: props.host,
      },
      props.abi,
      this.identity
    );
  }
}

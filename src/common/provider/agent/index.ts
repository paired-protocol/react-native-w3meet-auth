import { HttpAgent } from '@dfinity/agent';
import type { DelegationIdentity } from '@dfinity/identity';

export class AgentProvider {
  static create(host: string, identity?: DelegationIdentity) {
    const agent = new HttpAgent({
      host,
      identity,
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

    return agent;
  }
}

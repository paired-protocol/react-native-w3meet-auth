import { HttpAgent } from '@dfinity/agent';

export class AgentProvider {
  static create(host: string) {
    const agent = new HttpAgent({
      host,
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

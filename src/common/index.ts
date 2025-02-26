import { Actor, HttpAgent } from '@dfinity/agent';
import { Passkey } from 'react-native-passkey';

const idlFactory = ({ IDL }: any) => {
  return IDL.Service({
    authGenerateChallenge: IDL.Func([], [IDL.Text], ['query']),
  });
};

const agent = new HttpAgent({
  host: 'http://127.0.0.1:4943',
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

const actor: any = Actor.createActor(idlFactory, {
  agent,
  canisterId: 'bw4dl-smaaa-aaaaa-qaacq-cai',
});

type AuthenticatorProps = {
  canisterId: string;
};

export class Authenticator {
  canisterId: string;

  constructor(canisterId: string) {
    this.canisterId = canisterId;
  }

  static config(props: AuthenticatorProps) {
    return new Authenticator(props.canisterId);
  }

  async signIn() {
    const challenge = await actor?.authGenerateChallenge();

    console.log({ challenge });

    try {
      const response = await Passkey.create({
        challenge: String(challenge),
        user: {
          id: '1',
          name: 'Passkey Test',
          displayName: 'Passkey Test',
        },
        rp: {
          name: 'Passkey Test',
          id: 'w3meetauth.example',
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7,
          },
          {
            type: 'public-key',
            alg: -257,
          },
        ],
        timeout: 1800000,
        attestation: 'none',
        excludeCredentials: [],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
          residentKey: 'required',
          userVerification: 'required',
        },
      });

      console.log({ response });
    } catch (error) {
      console.log('Error to create passkey', error);
    }
  }
}

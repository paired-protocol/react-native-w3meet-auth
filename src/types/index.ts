import type { ActorMethod, ActorSubclass } from '@dfinity/agent';
import type { Ed25519KeyIdentity } from '@dfinity/identity';
import type { PasskeyCreateResult } from 'react-native-passkey';

export type TPubKeys = {
  [key: string]: {
    pubkey: string;
    base: Ed25519KeyIdentity;
  };
};

export type TPasskey = {
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  rp: {
    name: string;
    id: string;
  };
};

export type TPasskeyAuthenticationResponse = {
  error?: string;
  data?: {
    delegation: {
      pubkey: string;
      expiration: string;
    };
    signature: string;
  };
};

export type TAuthenticatorProps = {
  host: string;
  canisterId: string;
  passkey: TPasskey;
};

export type TActor = ActorSubclass<
  Record<string, ActorMethod<unknown[], unknown>> & {
    authRegisterPasskey: ActorMethod<[TPasskey['user']], string>;
    authValidatePasskey: ActorMethod<
      [string, TPasskey['user'], Partial<PasskeyCreateResult>],
      TPasskeyAuthenticationResponse
    >;
  }
>;

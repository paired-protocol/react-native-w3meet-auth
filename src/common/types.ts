import type { PasskeyCreateResult } from 'react-native-passkey';
import type { ActorMethod, ActorSubclass } from '@dfinity/agent';
import type { Ed25519KeyIdentity } from '@dfinity/identity';

import type { ABI } from './builder/idl/@types/ABI';

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
  data?: string;
};

export type TAuthenticatorProps = {
  host: string;
  canisterId: string;
};

export type TConfiguratorProps = {
  passkey: TPasskey;
  abi: ABI;
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

export type TIteratorProps = {
  actor: TActor;
  configurator: TConfiguratorProps;
  properties: TAuthenticatorProps;
};

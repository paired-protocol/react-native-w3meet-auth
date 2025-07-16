type User = {
  id: string;
  name: string;
  displayName: string;
};

type RP = {
  name: string;
  id: string;
};

type Passkey = {
  user: User;
  rp: RP;
};

type Canister = {
  id: string;
  host: string;
};

type ABI = Array<{
  name: string;
  type: string;
  inputs: Array<Record<string, any> | string>;
  outputs: Array<Record<string, any> | string>;
}>;

type CanisterAuthConnectorActor = ActorSubclass<
  Record<string, ActorMethod<unknown[], unknown>> & {
    authRegisterPasskey: ActorMethod<any, any>;
    authValidatePasskey: ActorMethod<
      [string, Passkey['user'], Partial<PasskeyCreateResult>],
      TPasskeyAuthenticationResponse
    >;
  }
>;

type CanisterAuthConnectorProps = {
  canister: Canister;
};

type CanisterAuthInvokeProps = {
  passkey: Passkey;
  abi: ABI;
};

type CanisterAttachProps = Canister & {
  useAuthentication: boolean;
  abi: ABI;
};

type CanisterAttachActor = ActorSubclass<
  Record<string, ActorMethod<unknown[], unknown>>
>;

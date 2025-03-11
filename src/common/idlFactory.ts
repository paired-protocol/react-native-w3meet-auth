export const idlFactory = ({ IDL }: any) => {
  return IDL.Service({
    authRegisterPasskey: IDL.Func(
      [
        IDL.Record({
          id: IDL.Text,
          displayName: IDL.Text,
          name: IDL.Text,
        }),
      ],
      [IDL.Text],
      []
    ),
    authValidatePasskey: IDL.Func(
      [
        IDL.Text,
        IDL.Record({
          id: IDL.Text,
          displayName: IDL.Text,
          name: IDL.Text,
        }),
        IDL.Record({
          id: IDL.Text,
          response: IDL.Record({
            clientDataJSON: IDL.Text,
            attestationObject: IDL.Text,
          }),
          rawId: IDL.Text,
        }),
      ],
      [
        IDL.Record({
          data: IDL.Record({
            signature: IDL.Text,
            delegation: IDL.Record({
              pubkey: IDL.Text,
              expiration: IDL.Text,
            }),
          }),
          error: IDL.Text,
        }),
      ],
      []
    ),
  });
};

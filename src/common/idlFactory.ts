export const idlFactory = ({ IDL }: any) => {
  return IDL.Service({
    authGenerateChallenge: IDL.Func([], [IDL.Text], ['query']),
    authValidatePasskey: IDL.Func(
      [
        IDL.Record({
          id: IDL.Text,
          response: IDL.Record({
            clientDataJSON: IDL.Text,
            attestationObject: IDL.Text,
          }),
          rawId: IDL.Text,
        }),
      ],
      [IDL.Bool],
      []
    ),
  });
};

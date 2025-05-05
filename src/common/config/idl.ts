export const IDL = {
  auth: [
    {
      name: 'authRegisterPasskey',
      type: 'function',
      inputs: [
        {
          id: 'text',
          displayName: 'text',
          name: 'text',
        },
      ],
      outputs: ['text'],
    },
    {
      name: 'authValidatePasskey',
      type: 'function',
      inputs: [
        'text',
        {
          id: 'text',
          displayName: 'text',
          name: 'text',
        },
        {
          id: 'text',
          response: {
            clientDataJSON: 'text',
            attestationObject: 'text',
          },
          rawId: 'text',
        },
      ],
      outputs: [
        {
          data: {
            signature: 'text',
            delegation: {
              pubkey: 'text',
              expiration: 'text',
            },
          },
          error: 'text',
        },
      ],
    },
  ],
};

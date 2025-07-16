import { Passkey, type PasskeyCreateResult } from 'react-native-passkey';
import { Platform } from 'react-native';
import type { TPasskey } from '../../types';

export class PasskeyProvider {
  static async create(
    challenge: string,
    passkey: TPasskey
  ): Promise<PasskeyCreateResult> {
    if (!challenge) {
      throw new Error('Challenge is required');
    }

    if (Platform.OS === 'android') {
      challenge = Buffer.from(challenge).toString('base64');
    }

    try {
      return Passkey.create({
        challenge,
        user: passkey.user,
        rp: passkey.rp,
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
    } catch (error) {
      throw new Error('Error to create passkey');
    }
  }
}

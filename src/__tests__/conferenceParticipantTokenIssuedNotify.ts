import { createMediaStreamMock } from 'webrtc-mock';
import SipConnector from '../SipConnector';
import { dataForConnectionWithoutAuthorization } from '../__fixtures__';
import {
  conferenceParticipantTokenIssuedData,
  conferenceParticipantTokenIssuedHeaders,
} from '../__fixtures__/conferenceParticipantTokenIssuedNotify';
import createSipConnector from '../__fixtures__/doMock';
import JsSIP from '../__fixtures__/jssip.mock';

describe('conference participant token issued notify', () => {
  const number = '111';

  let sipConnector: SipConnector;
  let mediaStream;

  beforeEach(() => {
    sipConnector = createSipConnector();
    mediaStream = createMediaStreamMock({
      audio: { deviceId: { exact: 'audioDeviceId' } },
      video: { deviceId: { exact: 'videoDeviceId' } },
    });
  });
  it('event conference:participant-token-issued', async () => {
    expect.assertions(1);

    const ua = await sipConnector.connect(dataForConnectionWithoutAuthorization);

    await sipConnector.call({ number, mediaStream });

    return new Promise<void>((resolve) => {
      sipConnector.on('conference:participant-token-issued', (data) => {
        expect(data).toEqual(conferenceParticipantTokenIssuedData);

        resolve();
      });

      JsSIP.triggerNewSipEvent(ua, conferenceParticipantTokenIssuedHeaders);
    });
  });
});

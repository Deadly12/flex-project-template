import * as Flex from "@twilio/flex-ui";
import { UIAttributes } from "types/manager/ServiceConfiguration";
import ConferenceService from "../../../../utils/serverless/ConferenceService/ConferenceService";

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration
  .ui_attributes as UIAttributes;
const { enabled = false } = custom_data?.features.conference || {};

export function handleUnholdConferenceParticipant(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  if (!enabled) return;

  flex.Actions.addListener(
    "beforeUnholdParticipant",
    async (payload, abortFunction) => {
      const { participantType, targetSid: participantSid, task } = payload;

      if (participantType !== "unknown") {
        return;
      }

      console.log("Unholding participant", participantSid);

      const { conferenceSid } = task.conference;
      abortFunction();
      await ConferenceService.unholdParticipant(conferenceSid, participantSid);
    }
  );
}

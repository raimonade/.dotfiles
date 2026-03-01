const SOUNDS = {
  success: "/System/Library/Sounds/Glass.aiff",
  error: "/System/Library/Sounds/Basso.aiff",
  complete: "/System/Library/Sounds/Ping.aiff",
  permission: "/System/Library/Sounds/Bottle.aiff",
};

export const NotificationPlugin = async ({ $, client }) => {
  const playSound = async (sound) => {
    try {
      await $`afplay ${SOUNDS[sound]}`;
    } catch {}
  };

  const isMainSession = async (sessionID) => {
    try {
      const result = await client.session.get({ path: { id: sessionID } });
      const session = result.data ?? result;
      return !session.parentID;
    } catch {
      return true;
    }
  };

  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        const sessionID = event.properties.sessionID;
        if (await isMainSession(sessionID)) {
          await playSound("complete");
        }
      }

      if (event.type === "permission.asked") {
        await playSound("permission");
      }
    },

    "tool.execute.after": async (toolInput, output) => {
      if (toolInput.tool === "swarm_finalize") {
        try {
          const result = JSON.parse(output.output ?? "{}");
          if (result.success) {
            await playSound("success");
          }
        } catch {}
      }

      if (toolInput.tool === "swarm_abort") {
        await playSound("error");
      }
    },
  };
};

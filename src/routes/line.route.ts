import { Router, Request, Response } from "express";
import crypto from "crypto";
import User from "../schemas/user.schema.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";
import { sendMessage } from "../lib/lineMessage.js";

const router = Router();

router.post("/webhook", (req: Request, res: Response) => {
  {
    const channelSecret = process.env.MSG_LINE_SECRET;
    if (!channelSecret) {
      console.log("Missing MSG_LINE_SECRET in env");
      return;
    }
    const body = JSON.stringify(req.body);
    const signature = crypto
      .createHmac("SHA256", channelSecret)
      .update(body)
      .digest("base64");

    // Compare x-line-signature request header and the signature
    const headerSignature = req.headers["x-line-signature"];
    if (!headerSignature) {
      res.status(400).send("Missing x-line-signature header");
      return;
    }

    if (signature !== headerSignature) {
      res.status(400).send("Invalid signature");
      return;
    }

    // Signature is valid, handle the request
    res.status(200).send("OK");

    // Loop through all events
    const events: Array<any> = req.body.events;
    events.forEach(async (event) => {
      // check for follow event
      if (event.type == "follow" && event.source?.userId) {
        // Get user profile details
        const getProfileReq = await fetch(
          `https://api.line.me/v2/bot/profile/${event.source.userId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.MSG_LINE_ACCESS_TOKEN}`,
            },
          }
        );
        const profile = await getProfileReq.json();
        const { userId, displayName } = profile;

        // Add user to db
        try {
          const existingUser = await User.findOne({ userId: userId });
          // Only add new user if they do not exist
          if (!existingUser) {
            const user = new User({ userId, displayName });
            await user.save();
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
});

router.get(
  "/message",
  authenticatedUser,
  async (req: Request, res: Response) => {
    if (!res.locals?.session) return res.redirect("/");

    try {
      const users = await User.find({});
      return res.render("message", {
        users: users,
        messageSent: false,
        errorMessage: null,
      });
    } catch (error) {
      console.error(error);
      return res.render("message", {
        users: [],
        messageSent: false,
        errorMessage: null,
      });
    }
  }
);

router.post(
  "/send-message",
  authenticatedUser,
  async (req: Request, res: Response) => {
    if (!res.locals?.session) return res.sendStatus(400);

    const recipient = req.body.recipient;
    const message = req.body.message;

    try {
      // Send the message...
      const messageSent = await sendMessage(recipient, [
        {
          type: "text",
          text: message,
        },
      ]);

      if (messageSent) {
        return res.render("message", {
          users: await User.find({}),
          messageSent: true,
        });
      } else {
        return res.render("message", {
          users: await User.find({}),
          messageSent: false,
          errorMessage: "An error occurred while sending the message.",
        });
      }
    } catch (error) {
      console.error(error);
      return res.render("message", {
        users: await User.find({}),
        messageSent: false,
        errorMessage: "An error occurred while sending the message.",
      });
    }
  }
);

export default router;

import { Request, Response } from "express";
import prisma from "../db/prisma";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user.id;

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, receiverId],
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [senderId, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Error in sendMessage: ", error.meesage);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: any) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [senderId, userToChatId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error: any) {
    console.error("Error in getMessage: ", error.meesage);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const authUserId = req.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: authUserId,
        },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        profilePic: true,
      },
    });

    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error in getUsersForSidebar: ", error.meesage);
    res.status(500).json({ error: "Internal server error" });
  }
};

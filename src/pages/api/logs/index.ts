import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import NextCors from "nextjs-cors";

interface LogNextApiRequest extends NextApiRequest {
  body: {
    message: string;
    originatedFrom?: string;
    tag?: string;
    logType?: string;
  };
}

export default async function handler(
  req: LogNextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  if (req.method === "POST") {
    const { message, originatedFrom, tag, logType } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        data: {
          message: "Missing message",
        },
      });
    }

    const log = await prisma.log.create({
      data: {
        message,
        originatedFrom,
        tag,
        logType,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        message: "Log created",
        log,
      },
    });
  } else if (req.method === "GET") {
    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        message: "Logs fetched",
        logs,
      },
    });
  }

  return res.status(405).json({ success: false });
}

import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await NextCors(req, res, {
    methods: ["GET", "POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { id } = req.query;

  if (req.method === "GET") {
    const log = await prisma.log.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        data: {
          message: "Log not found",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        message: "Log found",
        log,
      },
    });
  }

  return res.status(405).json({ success: false });
}

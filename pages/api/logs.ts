import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ['GET', 'POST'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  console.log(req.method);

  if (req.method === 'POST') {
    const { logs } = req.body;

    console.log(logs);
    return res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false });
}

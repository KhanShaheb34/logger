import { client } from '@/src/lib/redis';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { logs } = req.body;

    try {
      if (!client.isOpen) await client.connect();
      await client.rPush('logs', logs);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false });
    }
  } else if (req.method === 'GET') {
    try {
      if (!client.isOpen) await client.connect();
      const logs = await client.lRange('logs', 0, -1);
      return res.status(200).json({ success: true, logs });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false });
    }
  }

  return res.status(405).json({ success: false });
}

import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { logs } = req.body;

    console.log(logs);
    return res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    console.log('GET');
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false });
}

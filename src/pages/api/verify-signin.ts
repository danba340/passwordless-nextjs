// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const apiurl = process.env.API_URL || 'https://v3.passwordless.dev';
const API_SECRET = process.env.API_SECRET || 'API_SECRET';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = { token: req.query.token };

  console.log('Validating token', token);

  const response = await fetch(apiurl + '/signin/verify', {
    method: 'POST',
    body: JSON.stringify(token),
    headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json' },
  });

  var body = await response.json();
  if (body.success) {
    console.log('Succesfully verfied signin for user', body);
  } else {
    console.warn('Sign in failed', body);
    res.status(500).send(body);
    return;
  }
  res.status(200).send(body);
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

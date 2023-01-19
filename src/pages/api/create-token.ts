// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  token?: string;
  error?: string;
};

const apiurl = process.env.API_URL || 'https://v3.passwordless.dev';
const API_SECRET = process.env.API_SECRET || 'API_SECRET';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const userId = getRandomInt(999999999);
  const alias = req.query.alias;
  const displayname = 'Mr Guest';
  // grab the userid from session, cookie etc
  const payload = {
    userId,
    username: alias || displayname,
    displayname,
    aliases: alias ? [alias] : [], // We can also set aliases for the userid, so that signin can be initiated without knowing the userid
  };

  console.log('creating-token', payload);
  // Send the username to the passwordless api to get a token
  var response = await fetch(apiurl + '/register/token', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json' },
  });

  console.log('passwordless api response', response.status, response.statusText);

  if (response.status == 409) {
    res.status(409).json({ error: 'Ooops! Alias is already in use by another user. Please choose a unique alias' });
    return;
  }
  const token = await response.text();
  console.log('received token: ', token);
  res.status(200).send({ token });
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

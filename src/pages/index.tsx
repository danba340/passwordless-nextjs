import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Client } from '@passwordlessdev/passwordless-client';
import { useCallback, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })
const apiKey = "danielbark:public:2acc26b31b4247529fa387d952223570";
// const backendUrl = "http://localhost:8080";
const backendUrl = "/api";

export default function Home() {
  const [alias, setAlias] = useState("")
  const [logs, setLogs] = useState([`Welcome! Please register or sign in`])

  const register = useCallback(async function (alias: string) {
    if (!alias.length) return;
    const p = new Client({ apiKey });

    const { token, error } = await fetch(backendUrl + "/create-token?alias=" + alias).then((r) => r.json());

    console.log("Register succeded", token);
    if (error) {
      setLogs(prev => {
        return [...prev, `[${new Date().toLocaleTimeString()}]: ${error}`]
      })
      return
    }
    await p.register(token, "credential-nickname");
    setLogs(prev => {
      return [...prev, `[${new Date().toLocaleTimeString()}]: Successful Registration!`]
    })
  }, [])

  const signin = useCallback(async function (alias: string) {
    if (!alias.length) return;
    const p = new Client({ apiKey });
    const token = await p.signinWithAlias(alias);
    const user = await fetch(backendUrl + "/verify-signin?token=" + token).then((r) => r.json());
    console.log("User details", user);
    setLogs(prev => {
      return [...prev, `[${new Date().toLocaleTimeString()}]: User details: ${JSON.stringify(user, null, 2)}`]
    })
    return user;
  }, [])

  return (
    <>
      <Head>
        <title>Passwordless NextJS</title>
        <meta name="description" content="Example of passwordless nextjs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: 36 }}>
        <h2>Passwordless Minimal demo</h2>
        <p>To run this example you dont have to do anything other than supply a unique alias.</p>
        <div style={{ maxWidth: 400 }}>

          <input
            type="text"
            id="alias"
            placeholder="Unique Alias (Username, email)"
            value={alias}
            onChange={((e) => {
              setAlias(e.target.value)
            })}
          />
          <button
            onClick={() => register(alias)}
          >
            Register
          </button>
          <button
            onClick={() => signin(alias)}
          >
            Login
          </button>
        </div>
        <pre id="status">
          {logs.join("\n")}
        </pre>
      </main>
    </>
  )
}

import Head from "next/head";
import Login from "./login";
export default function Home() {
  return (
    <>
      <Head>
        <title>Institute Management</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login />
    </>
  );
}

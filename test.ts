import fetch from 'node-fetch';

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'A red apple' })
    });
    console.log(res.status, await res.text());
  } catch (e) {
    console.error(e);
  }
}

test();

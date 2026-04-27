import fetch from "node-fetch";

async function test() {
  const text = "这是一段测试翻译的内容。";
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}
test();

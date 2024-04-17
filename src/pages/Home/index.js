import './index.less';

const messages = [
  "Grabbing some tea...",
  "Compiling magic, please hold!",
  "Tweaking algorithms, stay tuned!",
  "Summoning digital sprites...",
  "Mixing the secret sauce!",
  "Waking up server hamsters...",
  "Casting binary spells!",
  "Baking JavaScript brownies...",
  "Assembling code legos!",
  "Planting feature seeds!"
];

export default function () {
  return <div class="home">
    <h1>{messages[Math.floor(Math.random() * messages.length)]}</h1>
  </div>;
};
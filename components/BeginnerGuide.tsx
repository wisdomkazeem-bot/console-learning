const BASICS = [
  {
    icon: "📝",
    title: "What is Code?",
    text: "Code is a set of instructions you write for a computer. Just like a recipe tells a chef what to do step by step, code tells the CPU what to do.",
  },
  {
    icon: "🔤",
    title: "Variables",
    text: "Variables are named boxes that store data. In Python: name = \"Mario\". In BASIC: 10 LET SCORE = 0. You can change what's inside anytime.",
  },
  {
    icon: "🔁",
    title: "Loops",
    text: "Loops repeat actions. A game loop runs 60 times per second, updating graphics and checking controls. FOR/NEXT and WHILE are common loop types.",
  },
  {
    icon: "❓",
    title: "If/Else",
    text: "Conditions make decisions. IF the player presses A THEN jump. IF score > 100 THEN show \"You Win!\". This is how games respond to players.",
  },
  {
    icon: "⚙️",
    title: "Functions",
    text: "Functions are reusable blocks of code. Instead of copying the same code, you write it once and call it by name: drawSprite(), playSound(), readInput().",
  },
  {
    icon: "🖥️",
    title: "Memory & Hardware",
    text: "Consoles have limited RAM and a CPU that runs millions of instructions per second. Retro consoles teach you to write efficient code within tight limits.",
  },
];

const FIRST_STEPS = [
  "Pick a Beginner console (Game Boy, C64, Raspberry Pi, or ESP32)",
  "Read the Overview tab to understand the hardware",
  "Try the Code Examples — read the beginner explanation first",
  "Copy code, experiment by changing values",
  "Watch YouTube tutorials from the Resources tab",
  "Build something small: blink an LED, print hello, move a sprite",
];

export default function BeginnerGuide() {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl" aria-hidden="true">🌱</span>
        <h2 className="font-pixel text-sm text-retro-green">NEW TO CODING? START HERE</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {BASICS.map((item) => (
          <div key={item.title} className="pixel-card">
            <span className="text-xl mb-2 block" aria-hidden="true">{item.icon}</span>
            <h3 className="font-pixel text-[9px] text-retro-yellow mb-2">{item.title}</h3>
            <p className="text-xs text-retro-muted leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="pixel-border bg-retro-surface p-6">
        <h3 className="font-pixel text-[10px] text-retro-cyan mb-4">YOUR FIRST STEPS</h3>
        <ol className="space-y-3">
          {FIRST_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-retro-text">
              <span className="font-pixel text-[8px] text-retro-green flex-shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

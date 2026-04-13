const types = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock",
  "ghost", "dragon", "dark", "steel", "fairy"
];

const typeChart = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 }
};

function getTypeMultiplier(x, y) {
  return typeChart[x]?.[y] ?? 1;
}

// UI
const type1 = document.getElementById("type1");
const type2 = document.getElementById("type2");

types.forEach(t => {
  type1.innerHTML += `<option value="${t}">${t}</option>`;
  type2.innerHTML += `<option value="${t}">${t}</option>`;
});

let isLeftAttacking = true;
let lastDamage = 0;

const container = document.querySelector(".container");
const arrow = document.getElementById("arrow");

function updateUI() {
  container.classList.toggle("left-attacks", isLeftAttacking);
  container.classList.toggle("right-attacks", !isLeftAttacking);

  document.querySelectorAll(".left-col").forEach(el =>
    el.classList.toggle("left-active", isLeftAttacking)
  );

  document.querySelectorAll(".right-col").forEach(el =>
    el.classList.toggle("right-active", !isLeftAttacking)
  );

  arrow.style.transform = isLeftAttacking ? "rotate(0deg)" : "rotate(180deg)";
  // arrow.textContent = isLeftAttacking ? "→" : "←";
}

document.getElementById("swapBtn").onclick = () => {
  isLeftAttacking = !isLeftAttacking;
  updateUI();
};

// Боевая механика
function getIZS(atk, al) {
  if(atk == 0){
    return 0;
  }
  return atk + al;
}

document.getElementById("battleBtn").onclick = () => {
  const atk1 = +document.getElementById("atk1").value || 0;
  const atk2 = +document.getElementById("atk2").value || 0;

  const def1 = +document.getElementById("def1").value || 0;
  const def2 = +document.getElementById("def2").value || 0;

  const al1 = +document.getElementById("al1").value;
  const al2 = +document.getElementById("al2").value;

  const typeUnit1 = type1.value;
  const typeUnit2 = type2.value;

  //calculation starts
  let izs1 = getIZS(atk1, al1);
  let izs2 = getIZS(atk2, al2);

  const mult1 = getTypeMultiplier(typeUnit1, typeUnit2);
  const mult2 = getTypeMultiplier(typeUnit2, typeUnit1);

  let damage = 0;
  let text = "";

  let dam1 = izs1 * mult1;
  let dam2 = izs2 * mult2;

  if (isLeftAttacking) {
    if (def2 > 0) {
      dam2 += def2;
    } 
    damage = dam1 - dam2;
    if (dam2 < 0) dam2 = "відсутня";
    text = `Ліва сторона атакує ${dam1} \n Контратака правої: ${dam2}`;

  } else {
    if (def1 > 0) {
      dam1 += def1;
    } 
    damage = dam2 - dam1;
    if (dam1 < 0) dam1 = "відсутня";
    text = `Права сторона атакує ${dam2} \n Контратака лівої: ${dam1}`;
  }

  // оценка эфвективности атаки
  let effectiveness = "";
  const usedMult = isLeftAttacking ? mult1 : mult2;

  if (usedMult > 1 && damage > 1) effectiveness = "🔥 Атака була супер ефективною! То що треба!";
  if (usedMult <= 1 || (damage <= 1 && damage > 0)) effectiveness = "😐 Могло б бути краще, спробуйте щось змінити в цьому житті, наприклад - обрати інший тип  атак";
  if (usedMult === 0 || damage <= 0) effectiveness = "❌ Не працює, аж зовсім, треба щось змінювати в цьому житті";


  //дамажить может и в обратную сторону
  lastDamage = damage;
  let damageResultText = "";

  if (damage > 0) {
    damageResultText = `Шкода для ${isLeftAttacking ? "правої" : "лівої"} сторони: ${damage}`;
  }
  else if (damage < 0) {
    damageResultText = `Контратака успішна!\nШкода для ${isLeftAttacking ? "лівої" : "правої"} сторони: ${Math.abs(damage)}`;
  }
  else {
    damageResultText = `Ніхто не отримав шкоди`;
  }

  document.getElementById("resultText").innerText =
    `${text }\n ${damageResultText} \n ${effectiveness}`;

  document.getElementById("applyBtn").classList.remove("hidden");
};

// применение урона
document.getElementById("applyBtn").onclick = () => {
  const res1 = +document.getElementById("res1").value || 0;
  const res2 = +document.getElementById("res2").value || 0;

  let changeSide = true;

  if (lastDamage > 0) {
    if (isLeftAttacking) {
      const hp = document.getElementById("unit2hp");
      hp.value = Math.max(0, (hp.value || 0) - lastDamage);

      if (lastDamage >= res2) changeSide = false;
    } else {
      const hp = document.getElementById("unit1hp");
      hp.value = Math.max(0, (hp.value || 0) - lastDamage);

      if (lastDamage >= res1) changeSide = false;
    }
  } 
  else if (lastDamage < 0) {
    const dmg = Math.abs(lastDamage);
    if (isLeftAttacking) {
      const hp = document.getElementById("unit1hp");
      hp.value = Math.max(0, (hp.value || 0) - dmg);

      if (dmg >= res1) changeSide = false;
    } else {
      const hp = document.getElementById("unit2hp");
      hp.value = Math.max(0, (hp.value || 0) - dmg);

      if (dmg >= res2) changeSide = false;
    }
  }

  if(changeSide){
    isLeftAttacking = !isLeftAttacking;
    updateUI();
  }
};

updateUI();
import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState({
    arpen: "",
    debuffs: {
      sunder: false,
      faerie: false,
      shattering: false,
    },
  });

  function handleInputChange(e) {
    if (e.target.name === "debuffs") {
      setInput({
        ...input,
        debuffs: {
          ...input.debuffs,
          [e.target.value]: e.target.checked,
        },
      });
      return;
    }
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  }

  const bossArmor = 10643;
  const [armorModifier, setArmorModifier] = useState(0);
  const [armor, setArmor] = useState(0);
  const [arpenCap, setArpenCap] = useState(0);
  const [effectiveArmor, setEffectiveArmor] = useState(0);
  const [damageReduced, setDamageReduced] = useState(0);
  const [damageApplied, setDamageApplied] = useState(0);

  useEffect(() => {
    setArmor(bossArmor * armorModifier);
  }, [armorModifier]);

  useEffect(() => {
    let counter = 1;
    if (input.debuffs.sunder) {
      counter *= 1 - 0.2;
    }
    if (input.debuffs.faerie) {
      counter *= 1 - 0.05;
    }
    if (input.debuffs.shattering) {
      counter *= 1 - 0.2;
    }
    setArmorModifier(counter);
  }, [input]);

  useEffect(() => {
    setArpenCap((armor + 15232.5) / 3);
  }, [armor]);

  useEffect(() => {
    if (arpenCap < armor) {
      setEffectiveArmor(armor - (Number(input.arpen) / 1399.6) * arpenCap);
    } else {
      setEffectiveArmor(armor - (Number(input.arpen) / 1399.6) * armor);
    }
  }, [arpenCap, input.arpen]);

  useEffect(() => {
    setDamageReduced(effectiveArmor / (effectiveArmor + 15232.5));
  }, [effectiveArmor]);

  useEffect(() => {
    setDamageApplied(1 - damageReduced);
  }, [damageReduced]);

  useEffect(() => {
    const resultDiv = document.getElementById("results");

    resultDiv.hidden = false;
    resultDiv.innerHTML = `
        <span>
        Boss Armor: <b>${bossArmor}</b>
      </span>
      <br />
      <br />
      <span>Boss Armor after debuffs: <b>${armor.toFixed(2)}</b></span>
      <br />
      <br />
      <span>Amount of armor you can effectively ignore: <b>${arpenCap.toFixed(
        2
      )}</b></span>
      <br />
      <br />
      <span>Damage reduced by boss' armor: <b>${damageReduced.toFixed(
        2
      )} %</b></span>
      <br />
      <br />
      <span>Final damage applied to boss: <b>${damageApplied.toFixed(
        2
      )} %</b></span>
        `;
    return;
  }, [damageApplied]);

  return (
    <div id="App">
      <h1>WoW WOTLK ArPen Rating Calculator</h1>
      <div className="wrapper">
        <div id="form">
          <form>
            <label htmlFor="arpen">Your ArPen Rating here:</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]+"
              name="arpen"
              id="arpen"
              min={null}
              value={input.arpen}
              onChange={handleInputChange}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <fieldset style={{ width: "fit-content" }}>
                <legend>Debuffs</legend>
                <input
                  type="checkbox"
                  name="debuffs"
                  id="sunder"
                  value="sunder"
                  onChange={handleInputChange}
                />
                <label htmlFor="sunder">Sunder Armor</label>
                <input
                  type="checkbox"
                  name="debuffs"
                  id="faerie"
                  value="faerie"
                  onChange={handleInputChange}
                />
                <label htmlFor="faerie">Faerie Fire</label>
                <input
                  type="checkbox"
                  name="debuffs"
                  id="shattering"
                  value="shattering"
                  onChange={handleInputChange}
                />
                <label htmlFor="shattering">Shattering Throw</label>
              </fieldset>
            </div>
          </form>
        </div>
        <div id="results" hidden></div>
      </div>
      <div id="reference">
        <p>
          All the formulas were taken from{" "}
          <cite>
            <a href="https://forum.warmane.com/showthread.php?t=298787">this</a>
          </cite>{" "}
          Warmane forum article. <br /> All credits to the original poster.
        </p>
      </div>
      <div className="madeBy">
        <p>
          Made by{" "}
          <a
            href="https://armory.warmane.com/character/Yakisieras/Frostmourne/summary"
            style={{
              textDecoration: "none",
              color: "rgba(255, 255, 255, 0.87)",
              display: "flex",
            }}
          >
            <img
              src="https://pugfinder.gg/images/icons/classes/warrior.png"
              alt="Warrior class logo"
            />
            Yakisieras
          </a>
          - Frostmourne
        </p>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState({
    arpen: 0,
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
      [e.target.name]: Number(e.target.value),
    });
  }

  //Issue where data doesnt update if you ONLY change arpen rating input

  const [loading, setLoading] = useState(true);

  const bossArmor = 10643;

  const [armorModifier, setArmorModifier] = useState(0);

  const [armor, setArmor] = useState(0);

  useEffect(() => {
    setArmor(bossArmor * armorModifier);
  }, [armorModifier]);

  const [arpenCap, setArpenCap] = useState(0);

  useEffect(() => {
    setArpenCap((armor + 15232.5) / 3);
  }, [armor]);

  const [effectiveArmor, setEffectiveArmor] = useState(0);

  useEffect(() => {
    if (arpenCap < armor) {
      setEffectiveArmor(armor - (input.arpen / 1399.6) * arpenCap);
    } else {
      setEffectiveArmor(armor - (input.arpen / 1399.6) * armor);
    }
  }, [arpenCap, input.arpen]);

  const [damageReduced, setDamageReduced] = useState(0);

  useEffect(() => {
    setDamageReduced(effectiveArmor / (effectiveArmor + 15232.5));
  }, [effectiveArmor]);

  const [damageApplied, setDamageApplied] = useState(0);

  useEffect(() => {
    setDamageApplied(1 - damageReduced);
    setLoading(false);
  }, [damageReduced]);

  useEffect(() => {
    const resultDiv = document.getElementById("results");
    if (!loading) {
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
    }
  }, [loading]);

  function handleOnClick(e) {
    e.preventDefault();
    setLoading(true);
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
  }

  return (
    <div id="App">
      <h1>WoW WOTLK ArPen Rating Calculator</h1>
      <div id="form">
        <form>
          <label htmlFor="arpen">Your ArPen Rating here:</label>
          <input
            type="number"
            name="arpen"
            id="arpen"
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
              <label htmlFor="shattering">Shattering Throw?</label>
            </fieldset>
          </div>
          <button onClick={(e) => handleOnClick(e)}>Calculate!</button>
        </form>
      </div>
      <div id="results" hidden></div>
      <div className="madeBy">
        <p>
          Made by{" "}
          <img
            src="https://pugfinder.gg/images/icons/classes/warrior.png"
            alt="Warrior class logo"
          />{" "}
          Yakisieras - Frostmourne
        </p>
      </div>
    </div>
  );
}

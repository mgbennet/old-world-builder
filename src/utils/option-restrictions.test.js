import { describe, expect, test } from "vitest";
import { checkOptionRestrictions } from "./option-restrictions";

const baseList = {
  armyComposition: "unknown-composition",
  points: 2000,
  characters: [],
  core: [
    { id: "badlands-ogre-bulls.1", name_en: "Badlands Ogre Bulls" },
    { id: "battle-pilgrims.1", name_en: "Battle Pilgrims" },
    { id: "black-guard-of-naggarond.1", name_en: "Black Guard of Naggarond" },
  ],
  special: [],
  rare: [],
  mercenaries: [],
  allies: [],
};

const getMessages = (errors) => errors.map((error) => error.message);

describe("checkOptionRestrictions", () => {
  test("adds maxOptionPerArmy when two units have a max 1 option", () => {
    const orcMob1 = {
      id: "orc-mob.1",
      name_en: "Orc Mob",
      options: [{
        id: "orc-mob-biguns",
        active: true,
        name_en: "Big 'Uns",
        notes: {
          name_en: "0-1 per army",
        },
        restrictions: {
          max: 1
        },
      }]
    }
    const orcMob2 = {
      id: "orc-mob.2",
      name_en: "Orc Mob",
      options: [{
        id: "orc-mob-biguns",
        active: true,
        name_en: "Big 'Uns",
        notes: {
          name_en: "0-1 per army",
        },
        restrictions: {
          max: 1
        },
      }]
    }
    const list = {
      ...baseList,
      core: [...baseList.core, orcMob1, orcMob2]
    }

    const errors = checkOptionRestrictions(orcMob1.id, orcMob1.options[0], list, "options");
    expect(errors).toEqual({
      message: "misc.error.maxOptionPerArmy",
      otherUnits: ["orc-mob.2"],
    });
  });
});

describe("checkOptionRestrictions", () => {
  test("adds maxOptionPerArmy when exceeding a max 1 per 1000 option", () => {
    const orcMob1 = {
      id: "orc-mob.1",
      name_en: "Orc Mob",
      options: [{
        id: "orc-mob-frenzy",
        active: true,
        name_en: "Frenzy",
        notes: {
          name_en: "0-1 per 1,000 points",
        },
        restrictions: {
          max: 1,
          points: 1000
        },
      }]
    }
    const orcMob2 = {
      id: "orc-mob.2",
      name_en: "Orc Mob",
      options: [{
        id: "orc-mob-frenzy",
        active: true,
        name_en: "Frenzy",
        notes: {
          name_en: "0-1 per 1,000 points",
        },
        restrictions: {
          max: 1,
          points: 1000
        },
      }]
    }
    const list = {
      ...baseList,
      core: [...baseList.core, orcMob1, orcMob2]
    }

    const errors1 = checkOptionRestrictions(orcMob1.id, orcMob1.options[0], list, "options");
    expect(errors1).toEqual([]);

    list.points = 1000;

    const errors2 = checkOptionRestrictions(orcMob1.id, orcMob1.options[0], list, "options");
    expect(errors2).toEqual({
      message: "misc.error.maxOptionPerArmy",
      otherUnits: ["orc-mob.2"],
    });
  });
});

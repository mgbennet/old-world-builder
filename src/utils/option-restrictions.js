
export const checkUnitOptionRestrictions = (unit, list) => {
  const errors = {};
  const categories = [
    "command",
    "equipment",
    "armor",
    "options",
    "mounts",
  ]
  for (let category of categories) {
    if (unit[category] && unit[category].length) {
      for (let option of unit.options) {
        if (option.active && option.restrictions) {
          errors[option.id] = checkOptionRestrictions(unit.id, option, list, "options");
        }
      }
    }
  }
  return errors;
}

export const checkOptionRestrictions = (unitId, option, list, optionType) => {
  if (option.id === undefined) {
    console.log("Options with restrictions require ids");
    return null;
  }
  const type = optionType || "options";

  const unitCategories = [
    "characters",
    "core",
    "special",
    "rare",
    "mercenaries",
    "allies",
  ];
  let count = 1;
  let otherUnits = [];
  for (let targetCategory of unitCategories) {
    for (let targetUnit of list[targetCategory]) {
      if (targetUnit.id !== unitId) {
        if (targetUnit[type]) {
          for (let targetOption of targetUnit[type]) {
            if (targetOption.id === option.id && targetOption.active) {
              count += 1;
              otherUnits.push({
                url: `/editor/${list.id}/${targetCategory}/${targetUnit.id}/`,
                unit: targetUnit,
              });
            }
          }
        }
      }
    }
  }
  const max = option.restrictions.points
      ? Math.floor(list.points / option.restrictions.points) * option.restrictions.max
      : option.restrictions.max;
  if (count > max) {
    return {
      message: "misc.error.maxOptionPerArmy",
      otherUnits
    }
  } else {
    return undefined;
  }
}

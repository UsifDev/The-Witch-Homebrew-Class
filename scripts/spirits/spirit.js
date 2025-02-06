import json from './data.json';

class Spirit {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  /**
   * Executes the spirit's functionality based on the binding mode.
   * @param {Actor} actor - The actor using the spirit.
   * @param {boolean} is_binding_mode - Whether the spirit is being bound or released.
   * @param {number} spell_slot - The spell slot level used for the spirit.
   */
  async execute(actor, is_binding_mode, spell_slot) {
    let content = this.getFlavorHTML(actor.name, this.name, is_binding_mode, spell_slot);
    if(this.description) content += this.getDescriptionHTML(this.description);
    content += this.getModeHTML((is_binding_mode ? "Binding" : "Releasing") + ".");

    const { usage, effect, formula, result } = this.getDetails(is_binding_mode, spell_slot);
    content += this.getUsageHTML(usage);
    content += this.getEffectHTML(effect);
    if (formula) content += this.getFormulaHTML(formula);
    if (result) content += this.getResultHTML(result);

    await ChatMessage.create({ content: content });
    this.logSpirit(is_binding_mode, spell_slot);
  }

  /**
   * Gets the details for the spirit's bind or release mode.
   * @param {boolean} is_binding_mode - Whether the spirit is being bound or released.
   * @param {number} spell_slot - The spell slot level used for the spirit.
   * @returns {Object} - An object containing usage, effect, formula, and result.
   */
  async getDetails(is_binding_mode, spell_slot) {
    throw new Error("async getDetails must be implemented by subclass");
  }

  getFlavorHTML(name, spirit, binding, slot) {
    if (binding) return this.wrapParagraphTags(`${name} united with a <strong>level ${slot} ${spirit}</strong> spirit!`);
    return this.wrapParagraphTags(`${name} released the <strong>level ${slot} ${spirit}</strong> spirit!`);
  }

  getDescriptionHTML(message) {
    return this.wrapParagraphTags(`<strong>Description: </strong>${message}`);
  }

  getModeHTML(message) {
    return this.wrapParagraphTags(`<strong>Mode: </strong>${message}`);
  }

  getEffectHTML(message) {
    return this.wrapParagraphTags(`<strong>Effect: </strong>${message}`);
  }

  getUsageHTML(message) {
    return this.wrapParagraphTags(`<strong>Usage: </strong>${message}`);
  }

  getFormulaHTML(message) {
    return this.wrapParagraphTags(`<strong>Formula: </strong>${message}`);
  }

  getResultHTML(message) {
    return this.wrapParagraphTags(`<strong>Result: </strong>${message}`);
  }

  wrapParagraphTags(message) {
    return `<p>${message}</p>`;
  }

  logSpirit(is_binding_mode, spell_slot) {
    console.log(`${is_binding_mode ? "Binded" : "Released"} ${this.name} to slot ${spell_slot}`);
  }
}

class Agony extends Spirit {
  constructor() {
    super("Agony", json.spirits.find(i => i.name == "Agony").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Agony");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      r = new Roll(`${spell_slot}d6`);
      await r.evaluate();
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${r.total}` + obj.release.result[1];
      r.toMessage();
      return obj.release;
    }
  }
}

class Desire extends Spirit {
  constructor() {
    super("Desire", json.spirits.find(i => i.name == "Desire").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Desire");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Empathy extends Spirit {
  constructor() {
    super("Empathy", json.spirits.find(i => i.name == "Empathy").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Empathy");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1] + `${spell_slot * 2}`;
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Envy extends Spirit {
  constructor() {
    super("Envy", json.spirits.find(i => i.name == "Envy").description);
  }
  
  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Envy");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Fear extends Spirit {
  constructor() {
    super("Fear", json.spirits.find(i => i.name == "Fear").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Fear");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Generosity extends Spirit {
  constructor() {
    super("Generosity", json.spirits.find(i => i.name == "Generosity").description);
  }
  
  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Generosity");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1] + `${spell_slot * 5}`;
      return obj.release;
    }
  }
}

class Guilt extends Spirit {
  constructor() {
    super("Guilt", json.spirits.find(i => i.name == "Guilt").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Guilt");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Hate extends Spirit {
  constructor() {
    super("Hate", json.spirits.find(i => i.name == "Hate").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Hate");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      r = new Roll(`${spell_slot}d6`);
      await r.evaluate();
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${r.total}` + obj.release.result[1];
      r.toMessage();
      return obj.release;
    }
  }
}

class Humility extends Spirit {
  constructor() {
    super("Humility", undefined);
  }
  
  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Humility");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1] + `${spell_slot + 8}`;
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Hunger extends Spirit {
  constructor() {
    super("Hunger", json.spirits.find(i => i.name == "Hunger").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Hunger");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Passion extends Spirit {
  constructor() {
    super("Passion", json.spirits.find(i => i.name == "Passion").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Passion");
    if (is_binding_mode) {
      r = new Roll(`${spell_slot}d6`);
      await r.evaluate();
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${r.total}` + obj.bind.result[1];
      r.toMessage();
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Pride extends Spirit {
  constructor() {
    super("Pride", json.spirits.find(i => i.name == "Pride").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Pride");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Serenity extends Spirit {
  constructor() {
    super("Serenity", json.spirits.find(i => i.name == "Serenity").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Serenity");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Sloth extends Spirit {
  constructor() {
    super("Sloth", json.spirits.find(i => i.name == "Sloth").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Sloth");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Sorrow extends Spirit {
  constructor() {
    super("Sorrow", json.spirits.find(i => i.name == "Sorrow").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Sorrow");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      r = new Roll(`${spell_slot}d6`);
      await r.evaluate();
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${r.total}` + obj.release.result[1];
      r.toMessage();
      return obj.release;
    }
  }
}

class Trust extends Spirit {
  constructor() {
    super("Trust", json.spirits.find(i => i.name == "Trust").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Trust");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Valor extends Spirit {
  constructor() {
    super("Valor", json.spirits.find(i => i.name == "Valor").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Valor");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

class Wonder extends Spirit {
  constructor() {
    super("Wonder", json.spirits.find(i => i.name == "Wonder").description);
  }

  async getDetails(is_binding_mode, spell_slot) {
    let obj = json.spirits.find(i => i.name == "Wonder");
    if (is_binding_mode) {
      if(obj.bind.result) obj.bind.result = obj.bind.result[0] + `${spell_slot}` + obj.bind.result[1];
      return obj.bind;
    } else {
      if(obj.release.result) obj.release.result = obj.release.result[0] + `${spell_slot}` + obj.release.result[1];
      return obj.release;
    }
  }
}

export default {
  Agony, 
  Desire,
  Empathy,
  Envy,
  Fear,
  Generosity,
  Guilt,
  Hate,
  Humility,
  Hunger,
  Passion,
  Pride,
  Serenity,
  Sloth,
  Sorrow,
  Trust,
  Valor,
  Wonder,
}
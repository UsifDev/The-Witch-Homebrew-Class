import json from './data';

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

class Spirit {
  constructor(record) {
    this.name = record.name;
    this.description = record.description;
    this.bind = record.bind || {};
    this.release = record.release || {};
  }

  /**
   * Executes the spirit's functionality based on the binding mode.
   * @param {Actor} actor - The actor using the spirit.
   * @param {boolean} is_binding_mode - Whether the spirit is being bound or released.
   * @param {number} spell_slot - The spell slot level used for the spirit.
   */
  async execute(actor, is_binding_mode, spell_slot) {
    let content = this.getFlavorHTML(actor.name, this.name, is_binding_mode, spell_slot);
    if (this.description) content += this.getDescriptionHTML(this.description);
    content += this.getModeHTML((is_binding_mode ? 'Binding' : 'Releasing') + '.');

    const details = await this.getDetails(is_binding_mode, spell_slot);
    if (!details) return;

    if (details.usage) content += this.getUsageHTML(details.usage);
    if (details.effect) content += this.getEffectHTML(details.effect);
    if (details.formula) content += this.getFormulaHTML(details.formula);
    if (details.result) content += this.getResultHTML(details.result);

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
    const template = is_binding_mode ? this.bind : this.release;
    if (!template) return {};

    const details = deepClone(template);
    if (details.result) {
      const replacements = await this.getResultReplacements(is_binding_mode, spell_slot);
      details.result = this.formatResult(details.result, replacements);
    }
    return details;
  }

  async getResultReplacements(is_binding_mode, spell_slot) {
    switch (this.name) {
      case 'Agony':
        return is_binding_mode ? [spell_slot] : [await this.rollDice(`${spell_slot}d6`)];
      case 'Desire':
        return [spell_slot];
      case 'Empathy':
        return is_binding_mode ? [spell_slot, spell_slot * 2] : [spell_slot];
      case 'Envy':
        return [spell_slot];
      case 'Fear':
        return [spell_slot];
      case 'Generosity':
        return is_binding_mode ? [spell_slot] : [spell_slot, spell_slot * 5];
      case 'Guilt':
        return [spell_slot];
      case 'Hate':
        return is_binding_mode ? [spell_slot] : [await this.rollDice(`${spell_slot}d6`)];
      case 'Humility':
        return is_binding_mode ? [spell_slot, spell_slot + 8] : [spell_slot];
      case 'Hunger':
        return [spell_slot];
      case 'Passion':
        return is_binding_mode ? [await this.rollDice(`${spell_slot}d6`)] : [spell_slot];
      case 'Pride':
        return [spell_slot];
      case 'Serenity':
        return [spell_slot];
      case 'Sloth':
        return [spell_slot];
      case 'Sorrow':
        return is_binding_mode ? [spell_slot] : [await this.rollDice(`${spell_slot}d6`)];
      case 'Trust':
        return [spell_slot];
      case 'Valor':
        return [spell_slot];
      case 'Wonder':
        return [spell_slot];
      default:
        return [spell_slot];
    }
  }

  async rollDice(formula) {
    const roll = new Roll(formula);
    await roll.evaluate({ async: true });
    roll.toMessage();
    return roll.total;
  }

  formatResult(resultTemplate, values) {
    if (typeof resultTemplate === 'string') return resultTemplate;

    let text = resultTemplate[0] || '';
    for (let index = 0; index < values.length; index += 1) {
      text += values[index];
      if (index + 1 < resultTemplate.length) {
        text += resultTemplate[index + 1];
      }
    }
    return text;
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
    console.log(`${is_binding_mode ? 'Binded' : 'Released'} ${this.name} to slot ${spell_slot}`);
  }
}

export const spirits = json.spirits.map((record) => new Spirit(record));
export default {
  spirits,
};
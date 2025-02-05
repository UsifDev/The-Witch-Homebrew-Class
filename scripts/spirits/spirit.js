export class Spirit {
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
    content += this.getDescriptionHTML(this.description);
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
  getDetails(is_binding_mode, spell_slot) {
    throw new Error("getDetails must be implemented by subclass");
  }

  // Helper methods for generating HTML content
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
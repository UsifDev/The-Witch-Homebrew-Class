import Spirit from "scripts/spirits/spirit.js";

/**
 * Spirit Binding Rites Module
 * A module for managing custom spirit binding mechanics.
 */

export class SpiritBindingRites {
    static JOURNAL_ENTRY_ID = "Roisin's Spirits";
    static SCOPE = "world";
    static FLAG_NAME = "spirit box";
    static INITIAL_BOX = {
      Agony: false,
      Desire: false,
      Empathy: false,
      Envy: false,
      Fear: false,
      Generosity: false,
      Guilt: false,
      Hate: false,
      Humility: false,
      Hunger: false,
      Passion: false,
      Pride: false,
      Serenity: false,
      Sloth: false,
      Sorrow: false,
      Trust: false,
      Valor: false,
      Wonder: false,
    };
  
    /**
     * Initialize the module.
     */
    static init() {
      console.log("Spirit Binding Rites | Initializing module.");
    }

    /**
     * Ready the module.
     */
    static ready() {
        console.log("Spirit Binding Rites | Ready hook triggered.");
        // Add a button or hook to trigger the main functionality
        Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
          buttons.unshift({
            label: "Spirit Binding",
            class: "spirit-binding",
            icon: "fas fa-magic",
            onclick: () => SpiritBindingRites.Main(sheet.actor),
          });
        });
    }
  
    /**
     * Main function to handle spirit binding and releasing.
     * @param {Actor} actor - The actor using the spirit binding rites.
     */
    static async Main(actor) {
        if (!SpiritBindingRites.CanCastBindingRites(actor)) {
          return SpiritBindingRites.SendErrorMsg("Your character can't cast Binding Rites");
        }
    
        let spirits = SpiritBindingRites.GetSpiritBox(actor);
        if (spirits === undefined) {
          spirits = await SpiritBindingRites.FlagInitializer(actor);
        }
    
        const bindDialog = SpiritBindingRites.createBindDialog(actor, spirits);
        const releaseDialog = SpiritBindingRites.createReleaseDialog(actor, spirits);
        const mainDialog = SpiritBindingRites.createMainDialog(actor, bindDialog, releaseDialog);
        await mainDialog.render(true);
    }
  
    static SendErrorMsg(message) {
        return ui.notifications.error(message);
    }
      
    static CanCastBindingRites(actor) {
    return actor.items.find((i) => i.name === "Binding Rites");
    }
      
    static GetSpiritBox(actor) {
    return actor.getFlag(SpiritBindingRites.SCOPE, SpiritBindingRites.FLAG_NAME);
    }
      
    static async UpdateSpiritBox(actor, flag_object) {
    return await actor.setFlag(SpiritBindingRites.SCOPE, SpiritBindingRites.FLAG_NAME, flag_object);
    }
      
    static async UpdateSpirit(actor, spirit_name, spirit_level, is_binding) {
    let box = SpiritBindingRites.GetSpiritBox(actor);
    if (is_binding) {
        box[spirit_name] = spirit_level;
    } else {
        box[spirit_name] = false;
    }
    await SpiritBindingRites.UpdateSpiritBox(actor, box);
    }
      
    static async FlagInitializer(actor) {
    return await SpiritBindingRites.UpdateSpiritBox(actor, SpiritBindingRites.INITIAL_BOX);
    }

    static createBindDialog(actor, spirits) {
        let slots_options_text = "";
        for (let spell_level in actor.system.spells) {
          if (spell_level == "pact") continue;
          if (actor.system.spells[spell_level].value > 0) {
            slots_options_text += `<option value="${spell_level}">spell level ${actor.system.spells[spell_level].level} : (${actor.system.spells[spell_level].value}) available slots</option>`;
          }
        }
      
        let spirits_options_text = "";
        for (let [spirit_name, level] of Object.entries(spirits)) {
          if (!level) spirits_options_text += `<option value="${spirit_name}">${spirit_name}</option>`;
        }
      
        let content = `
          <div class="form-group">
            <label>Choose the spirit's Level</label>
            <div class="form-fields">
              <select name="slot_level">${slots_options_text}</select>
            </div>
          </div>
          <div class="form-group">
            <label>Choose a spirit to bind with you</label>
            <div class="form-fields">
              <select name="spirit_name">${spirits_options_text}</select>
            </div>
          </div>
        `;
      
        return new foundry.applications.api.DialogV2({
            window: { title: "Binding Rites: Bind mode Configuration" },
            content: content,
            modal: true,
            buttons: [
                {
                    action: "confirm",
                    icon: "fas fa-check",
                    label: "Call upon the spirit!",
                    callback: (event,button,dialog) => {
                        return [
                            button.form.elements.slot_level.value,
                            button.form.elements.spirit_name.value,
                        ]
                    }
                },
                {
                    action: "cancel",
                    icon: "fas fa-times",
                    label: "Cancel",
                    default: true,
                }
            ],
            submit: result => {
                if (result === "cancel") return;
                let spell_level = result[0];
                let spirit_name = result[1];
                let spirit_func = spirit_funcs.find(value => value.name == spirit_name);
                SpiritBindingRites.CastSpell(actor, spell_level, spirit_name, binding = true , spirit_func);
            }
        });
    }

    static createReleaseDialog(actor, spirits) {
        let options_text = "";
        for (let [spirit_name, level] of Object.entries(spirits)) {
          if (level) options_text += `<option value="${spirit_name}">${spirit_name} level ${level}</option>`;
        }
      
        let content = `
          <div class="form-group">
            <label>Choose a spirit to sever your bond with</label>
            <div class="form-fields">
              <select name="spirit">${options_text}</select>
            </div>
          </div>
        `;
      
        return new foundry.applications.api.DialogV2({
            window: { title: "Binding Rites: Release mode Configuration" },
            content: content,
            modal: true,
            buttons: [
                {
                    action: "confirm",
                    icon: "fas fa-check",
                    label: "Confirm",
                    callback: (event,button,dialog) => button.form.elements.spirit.value
                },
                {
                    action: "cancel",
                    icon: "fas fa-times",
                    label: "Cancel",
                    default: true,
                }
            ],
            submit: result => {
                if (result === "cancel") return;
                let spirit_name = result;
                let spell_level = `spell${spirits[spirit_name]}`;
                let spirit_func = spirit_funcs.find((value) => value.name == spirit_name);
                SpiritBindingRites.CastSpell(actor, spell_level, spirit_name, binding = false , spirit_func);
            }
        });
    }

    static createMainDialog(actor, bindDialog, releaseDialog) {
        let options = "";
        [1, 2, 3, 4, 5].forEach((count) => {
          options += `<option value="${count}">${count}</option>`;
        });
      
        let content = `
          <form id="binding-rites-form">
            <div class="form-group">
              <p>${game.i18n.format("DND5E.AbilityUseHint", { name: "Binding Rites", type: "spell" })}</p>
            </div>
            <div class="form-group">
              <label>Select current maximum bonds (required for binding spirits)</label>
              <div class="form-fields">
                <select name="bonds">${options}</select>
              </div>
            </div>
          </form>
        `;
      
        return new foundry.applications.api.DialogV2({
            window: { title: "Binding Rites: Mode Selection"},
            content: content,
            buttons: [
                {
                    action: "bind",
                    icon: "fas fa-check",
                    label: "Call upon the spirit!",
                    callback: (event,button,dialog) => button.form.elements.bonds.valueAsNumber
                },
                {
                    action: "release",
                    icon: "fas fa-check",
                    label: "Release the spirit!",
                },
                {
                    action: "cancel",
                    icon: "fas fa-times",
                    label: "Cancel",
                    default: true,
                }
            ],
            submit: result => {
                if (result === "cancel") return;
                let max_bonds = result;
                if(result === "release"){
                    if (SpiritBindingRites.GetSpiritsCount(actor) == 0)
                        return SpiritBindingRites.SendErrorMsg("Your character isn't united with any spirits");
                    releasing_dialog.render({ force: true });
                } else {
                    if (SpiritBindingRites.GetSpiritsCount(actor) > max_bonds)
                        return SpiritBindingRites.SendErrorMsg(`Current spirit count (${SpiritBindingRites.GetSpiritsCount(actor)}) is higher than entered maximum bonds (${max_bonds}). Please select a valid number!`)
                    if (!SpiritBindingRites.hasAnyAvailableSlot(actor))
                        return SpiritBindingRites.SendErrorMsg("Your character doesn't have any spell slots left");
                    binding_dialog.render({ force: true });
                }
            }
        });
    }

    static spirit_funcs = {
        Agony: async ({ actor, is_binding_mode, spell_slot }) => {
          // Implementation for Agony spirit
        },
        Desire: async ({ actor, is_binding_mode, spell_slot }) => {
          // Implementation for Desire spirit
        },
        // Add implementations for other spirits...
    };
      
    static async CastSpell(actor, spell_level, spirit_name, binding, spirit_func) {
        const override = actor.system.spells[spell_level].override;
        const max = actor.system.spells[spell_level].max;
        const value = actor.system.spells[spell_level].value;
      
        if (binding) {
          await actor.update({
            [`system.spells.${spell_level}.override`]: override ? max - 1 : override - 1,
            [`system.spells.${spell_level}.value`]: value - 1,
          });
          await SpiritBindingRites.UpdateSpirit(actor, spirit_name, actor.system.spells[spell_level].level, binding);
        } else {
          await actor.update({
            [`system.spells.${spell_level}.override`]: override ? max + 1 : override + 1,
            [`system.spells.${spell_level}.value`]: value + 1,
          });
          await SpiritBindingRites.UpdateSpirit(actor, spirit_name, actor.system.spells[spell_level].level, binding);
        }
      
        await spirit_func({ actor, is_binding_mode: binding, spell_slot: actor.system.spells[spell_level].level });
        await SpiritBindingRites.updateSpiritBoxJournal(actor, SpiritBindingRites.JOURNAL_ENTRY_ID);
    }

    static async updateSpiritBoxJournal(actor, journalEntryId) {
        const spiritBox = SpiritBindingRites.GetSpiritBox(actor);
      
        let content = `<h2>Spirit Box Status</h2>`;
        content += `<table><tr><th>Spirit</th><th>Status</th><th>Level</th></tr>`;
      
        for (const [spiritName, level] of Object.entries(spiritBox)) {
          const status = level ? `Bound (Level ${level})` : "Unbound";
          content += `<tr><td>${spiritName}</td><td>${status}</td><td>${level || "-"}</td></tr>`;
        }
      
        content += `</table>`;
      
        const journalEntry = game.journal.get(journalEntryId);
        if (!journalEntry) {
          console.error(`Journal entry with ID ${journalEntryId} not found.`);
          return;
        }
      
        await journalEntry.update({ content: content });
        console.log("Spirit Box Journal updated successfully.");
    }
}
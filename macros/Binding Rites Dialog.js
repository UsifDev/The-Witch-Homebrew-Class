// A macro for custom spirit binding spell
// Author: UsifDev 
// created 26-Jan-2025
// Last edit 21-Jan-2025

if (!CanCastBindingRites())
    return SendErrorMsg("Your character can't cast Binding Rites");

const JOURNAL_ENTRY_ID = "Roisin's Spirits";
const scope = "world";
const flag_name = "spirit box";
const initial_box = {
    Agony : false ,
    Desire : false ,
    Empathy : false ,
    Envy : false ,
    Fear : false ,
    Generosity : false ,
    Guilt : false ,
    Hate : false ,
    Humility : false ,
    Hunger : false ,
    Passion : false ,
    Pride : false ,
    Serenity : false ,
    Sloth : false ,
    Sorrow : false ,
    Trust : false ,
    Valor : false ,
    Wonder : false ,
};

////////////////////////////////////////////
//------------ERROR HANDLING----------------
////////////////////////////////////////////
function SendErrorMsg( message ){
    return ui.notifications.error(message);
}

function logSpirit( binding, spirit_name, spell_slot){
    console.log(`${binding ? "Binded": "Released"} ${spirit_name} to slot ${spell_slot}`);
}

function CanCastBindingRites(){
    return actor.items.find(i => i.name === "Binding Rites");
}

function hasAnyAvailableSlot() {
    for (let spell_level in actor.system.spells) {
        if(spell_level == "pact") continue;
        if (actor.system.spells[spell_level].value > 0) {
            return true;
        }
    }
    return false;
}

////////////////////////////////////////////
//-----------------FLAGS--------------------
////////////////////////////////////////////
function GetSpiritsCount(){
    let box = GetSpiritBox();
    let result = 0;
    for (let value of Object.values(box)){
        if(value != false) result += 1;
    }
    return result;
}

async function UpdateSpiritBox(flag_object) {
    return await actor.setFlag(scope, flag_name, flag_object);
}
function GetSpiritBox() {
    return actor.getFlag(scope, flag_name);
}

async function UpdateSpirit( spirit_name, spirit_level, is_binding ) {
    let box = GetSpiritBox();
    if(is_binding) {
        box[spirit_name] = spirit_level;
    } else {
        box[spirit_name] = false;
    }
    await UpdateSpiritBox(box);
}

async function FlagInitializer() {
    return await UpdateSpiritBox(initial_box);
}
////////////////////////////////////////////
//----------------SPIRITS------------------
////////////////////////////////////////////
let Agony = async ({ is_binding_mode, spell_slot }) => {
    let name = "Agony";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "In the presence of a spirit of Agony, foes' wounds continue to bleed and fires continue to burn. ";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `When you roll damage for an attack or spell, for each 1 on a damage die, you can add the level of the spirit to the damage total.`;
    let Effect = "Adds bonus damage to damage rolls, based on a digit's count of a damage roll.";
    let Formula = "Bonus damage = level * count of 1s";
    let Result = `Bonus damage = (${spell_slot}) * (count of 1s)`;
    let r;
    if(!is_binding_mode){
        Usage = `You can release Agony as a reaction when you roll the highest possible number on a damage die.`;
        Effect = `Roll a number of d6s equal to the spirit's level and add the total to the triggering damage as psychic damage.`;
        Formula = `Psychic damage = (the spirit's level)d6 + the damage crit's value`;
        r = new Roll(`${spell_slot}d6`);
        await r.evaluate();
        Result = `Psychic damage = ${r.total} + (the damage crit's value)`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    if(!is_binding_mode) r.toMessage();
    logSpirit(name, is_binding_mode, spell_slot);
}
let Desire = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Desire";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Desire impress your will onto others and enhance existing desires.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `Friendly and charmed creatures within 30 feet of you have disadvantage on Wisdom saving throws against your spells. Once a creature succeeds on a Wisdom saving throw against one of your spells, that creature is immune to this spirit's passive effect for 24 hours.`;
    let Effect = "Applies disadvantage on Wis throws for allies against your spells within 30ft";
    let Result = "";
    if(!is_binding_mode){
        Usage = `When you release this spirit as a bonus action, you attempt to charm a creature you can see within 30 feet of you. At 3rd level and below, only humanoids and beasts are affected. At 4th level and above, all creatures can be affected.`;
        Effect = `The target must succeed on a Wisdom saving throw against your spell save DC or be charmed by you for 1 minute or until it takes damage.`;
        Result = `Spirit's Level = (${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(!is_binding_mode) content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Empathy = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Empathy";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Empathy force your enemies to share your pain.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `Whenever a creature deals damage to you, you can use your reaction to retaliate.`;
    let Effect = "The creature takes psychic damage equal to twice the spirit's level.";
    let Formula = "Psychic damage = level * 2";
    let Result = `Psychic damage = (${spell_slot}) * 2 = ${spell_slot * 2}`;
    if(!is_binding_mode){
        Usage = `You can release Empathy as a reaction whenever a creature deals damage to you or an ally within 30 feet of you.`;
        Effect = `The creature takes psychic damage equal to the triggering damage + the spirit's level.`;
        Formula = `Psychic damage = the spirit's level + triggering damage`;
        Result = `Psychic damage = (${spell_slot}) + (triggering damage)`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Envy = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Envy";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Envy take from others what they covet for themselves - life. ";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `Once on each of your turns, when you damage a creature with an attack or spell while Envy is bound, you regain a number of hit points equal to the level of the spirit.`;
    let Effect = "";
    let Formula = "";
    let Result = "";
    if(is_binding_mode){
        Effect = `Passive lifesteal effect that can be applied once every turn when you damage a creature.`;
        Formula = `HP gained = level `;
        Result = `HP gained = (${spell_slot})`;
    } else {
        Usage = `When you deal damage to a creature with an attack or spell you can release Envy as a reaction. When you do so, you gain a number of temporary hit points equal to the triggering damage.`;
        Effect = `Adds temp HP when you deal damage`;
        Formula = `Temp HP = triggering damage`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    if(is_binding_mode) content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Fear = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Fear";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Fear bring nightmares to life. ";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `While Fear is bound, you can add your proficiency bonus to Charisma (Intimidation) checks, or double it if you already do. Additionally, creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach.`;
    let Effect = "Doubles or adds prof. bonus to Intimidation and enemy provokes opportunity attacks regardless if they disengaged";
    let Formula = "";
    let Result = "";
    if(!is_binding_mode){
        Usage = `When Fear is released from its bonds as a bonus action, a number of creatures equal to the spirit's level within 30 feet of you must succeed on Wisdom saving throw against your spell save DC or be frightened of you for 1 minute. A frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.`;
        Effect = `Selected creatures within 30ft can become frightened for 1 minute if they fail on a Wis throw.`;
        Formula = `Creature count limit = the spirit's level`;
        Result = `Creature count limit = (${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(!is_binding_mode){
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Generosity = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Generosity";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Generosity are always willing to make sacrifices for those who bind them with good intentions.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `Your spells that restore hit points restore additional hit points equal to the spirit's level.`;
    let Effect = "Adds bonus hit points to all spells that heal";
    let Formula = "Bonus HP to healing spells = level";
    let Result = `Bonus HP to healing spells = ${spell_slot}`;
    if(!is_binding_mode){
        Usage = `You can release Generosity as a bonus action and gift the spirit to an ally within 30 feet of you.`;
        Effect = `The spirit protects the ally for 10 minutes, granting them a number of temporary hit points equal to 5 times the spirit's level.`;
        Formula = `Bonus temp HP = the spirit's level * 5`;
        Result = `Bonus temp HP = (${spell_slot}) * 5 = ${spell_slot * 5}`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Guilt = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Guilt";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Guilt cause your enemies hesitation in acts that would wrong you.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `While Guilt is bound, when you are attacked you can use your reaction to gain a bonus to AC against that attack equal to the level of the spirit. You can use this feature a number of times equal to the spirit's level. You regain all expended uses when you finish a long rest.`;
    let Effect = "Limited use AC bonus, uses and bonus both = spirit's level.";
    let Formula = "AC bonus and uses = level";
    let Result = `AC bonus and uses = (${spell_slot})`;
    if(!is_binding_mode){
        Usage = `When you release Guilt from your power as a bonus action, one creature you can see within 60 feet has disadvantage on attack rolls against you for 1 minute. At the end of each of its turn the target can make a Wisdom saving throw against your spell save DC, ending the effect on itself on a success.`;
        Effect = `Applies disadvantage on attack rolls for one creature within 60ft for 1 minute.`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(is_binding_mode){
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Hate = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Hate";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Hate inspire a ferocity in you.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `When you are damaged by a creature, you can choose to channel Hate and gain advantage on attack rolls against that creature until the end of your next turn. You can use this feature a number of times equal to the spirit's level. You regain all expended uses when you finish a long rest.`;
    let Effect = "Limited use attack advantage towards a creature who damaged you.";
    let Formula = "Uses = level";
    let Result = `Uses = (${spell_slot})`;
    if(!is_binding_mode){
        Usage = `When you damage a creature with an attack you can release Hate as a reaction.`;
        Effect = `Roll a number of d6s equal to the spirit's level and add the total to the triggering damage as necrotic damage.`;
        Formula = `Necrotic damage = (the spirit's level)d6 + the damage value`;
        let r = new Roll(`${spell_slot}d6`);
        await r.evaluate();
        Result = `Necrotic damage = ${r.total} + (the damage value)`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    if(!is_binding_mode) r.toMessage();
    logSpirit(name, is_binding_mode, spell_slot);
}
let Humility = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Humility";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += Mode;
    let Usage = `When you make an ability check with which you are not proficient at disadvantage, the result can not be lower than 8 + the level of this spirit.`;
    let Effect = "Caps the minimum of any non-proficient ability roll to 8 + spirit's level.";
    let Formula = "Minimum = 8 + level";
    let Result = `Minimum = 8 + (${spell_slot}) = ${8 + spell_slot}`;
    if(!is_binding_mode){
        Usage = `As a reaction when a creature you can see makes a saving throw or ability check, you can release Humility from your power to bestow it upon the creature. Add the spirit's level to the roll. You can do so after the roll, but must decide before the DM says whether the roll succeeds or fails.`;
        Effect = `Adds a bonus to the ability or save of a creature in your sight`;
        Formula = `Bonus = level`;
        Result = `Bonus = (${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Hunger = async ({ is_binding_mode, spell_slot }) => {
    let name = "Hunger";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Hunger sustain their binder and deprive their enemies of energy.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `While Hunger is bound you require no food or water.`;
    let Effect = "";
    let Formula = "";
    let Result = "";
    if(!is_binding_mode){
        Usage = `You can release Hunger as a bonus action to exhaust a number of creatures within 30 feet of you equal to the spirit's level. A target gains one level of exhaustion, and cannot be affected by a Spirit of Hunger for 24 hours.`;
        Effect = `Selected creatures within 30ft become exhausted`;
        Formula = `Creature count limit = the spirit's level`;
        Result = `Creature count limit = (${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    if(!is_binding_mode){
        content += GetEffectHTML(Effect);
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Passion = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Passion";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Passion give those who bind them the power to push themselves and others to greater heights of success.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `While this spirit is bound you can channel Passion when you make an attack roll, ability check or saving throw, or when an ally within 30 feet of you does, you roll a d6 and add the number rolled to the total.You can use this feature a number of times equal to the spirit's level. You regain all expended uses when you finish a long rest. You lose all remaining dice when you release Passion.`;
    let Effect = "Limited use bonus to your or an ally within 30ft on attack rolls, ability checks or saving throws.`";
    let Result = "";
    let r;
    if(is_binding_mode){
        Formula = `Bonus = (the spirit's level)d6 + the roll's value`;
        r = new Roll(`${spell_slot}d6`);
        await r.evaluate();
        Result = `Bonus = ${r.total} + (the previous roll's value)`;
    } else {
        Usage = `You can release Passion as a reaction when you make an attack roll, ability check, or saving throw. You gain advantage on the roll. Additionally, you and each friendly creature within 30 feet of you gain a d6 that lasts until the end of your next turn. A creature can expend and roll the d6 when they make an attack roll or ability check, adding it to the total.`;
        Effect = `You gain advantage on your attack roll, ability check, or saving throw. You and allies within 30f gain a bonus d6 on attack rolls, ability checks or saving throws until your next turn.`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(is_binding_mode) content += `<p><strong>Uses count: </strong>Uses = level = (${spell_slot})</p>`;
    else content += `<p><strong>Bonus roll's formula: </strong>1d6</p>`;
    if(is_binding_mode) content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    if(is_binding_mode) r.toMessage();
    logSpirit(name, is_binding_mode, spell_slot);
}
let Pride = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Pride";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Creatures in your presence are more easily filled with a dangerous sense of pride, oversight, and overconfidence.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `When you make an ability check that is contested by a creature you can see, you gain a bonus to the ability check equal to the spirit's level.`;
    let Effect = "";
    let Formula = "";
    let Result = "";
    if(is_binding_mode){
        Effect = `Situational ability check bonus.`;
        Formula = `Bonus = level`;
        Result = `Bonus = (${spell_slot})`;
    } else {
        Usage = `When a creature you can see succeeds on an attack roll or ability check, you can release Pride as a reaction to curse that creature to a disgraceful fall. The next time the target makes an attack roll or ability check, it does so with disadvantage, and subtracts the spirit's level from the total.`;
        Effect = `Curse a creature with disadvantage on the next attack roll or ability check and subtract the spirit's level from the total.`;
        Formula = `Bonus = -1 * level`;
        Result = `Bonus = -(${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Serenity = async ( { is_binding_mode, spell_slot } ) => {
    let name = "Serenity";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Serenity bring peace and clarity of thought to those who bind them.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `You don't need to sleep. Instead, you can meditate deeply, remaining semiconscious, for 4 hours a day. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep. Additionally, if you or any friendly creatures who can see you regain hit points at the end of a short rest by spending one or more Hit Dice, each of those creatures regains a number of additional hit points equal to the level of the spirit.`;
    let Effect = "";
    let Formula = "";
    let Result = "";
    if(is_binding_mode){
        Effect = `Short rest = long rest for you. And, Bonus hp regen to you and allies within sight who spend hit dice after a short rest.`;
        Formula = `Bonus HP after short rest = level`;
        Result = `Bonus HP after short rest = (${spell_slot})`;
    } else {
        Usage = `When you release Serenity from your power at the start of your turn (no action required), you are no longer blinded, deafened, frightened, paralysed, poisoned, or stunned.`;
        Effect = `Cleanses you from multiple negative effects at the start of your turn`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(is_binding_mode) {
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Sloth = async ( { is_binding_mode, spell_slot } ) => {
    let name =  "Sloth";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Sloth inspire sluggishness and laziness of thought and action around you.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `While Sloth is bound, the ground within 15 feet of you is difficult terrain for your enemies.`;
    let Effect = "Applies difficult terrain effect over a radius only for enemies.";
    if(!is_binding_mode){
        Usage = `When you release Sloth as a bonus action, you can slow a number of creatures up to the spirit's level that you can see.`;
        Effect = `A target must make a Wisdom saving throw against your spell save DC. On a failed save a target is slowed until the end of their next turn, and can take either an action or bonus action on their turn, not both.`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Sorrow = async ( { is_binding_mode, spell_slot } ) => {
    let name =  "Sorrow";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "The failures of your enemies continue to haunt them in the presence of a spirit of Sorrow.";
    let Mode = GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    content += GetDiscriptionHTML(Description);
    content += Mode;
    let Usage = `While Sorrow is bound to you, when a creature fails a saving throw against one of your spells of 1st level or higher, it takes psychic damage equal to the spirit's level.`;
    let Effect = "";
    let Formula = "";
    let Result = "";
    let r;
    if(is_binding_mode){
        Effect = `Applies psychic damage to a creature that fails a throw against your 1st level or higher spells`;
        Formula = `Psychic damage = the spirit's level`;
        Result = `Psychic damage = (${spell_slot})`;
    } else {
        Usage = `When Sorrow is released as a bonus action, choose a creature you can see within 30 feet of you. The target has disadvantage on the next attack roll or ability check it makes before the end of its next turn. If it misses that attack roll or fails the ability check, roll a number of d6s equal to the spirit's level. The target takes psychic damage equal to the total.`;
        Effect = `Curses a chosen creature within 30ft with disadvantage on the next attack roll or ability check within it's next turn. Upon failing or missing, it takes psychic damage`;
        Formula = `Psychic damage = (the spirit's level)d6`;
        r = new Roll(`${spell_slot}d6`);
        await r.evaluate();
        Result = `Psychic damage = ${r.total}`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    content += GetFormulaHTML(Formula);
    content += GetResultHTML(Result);
    await ChatMessage.create({content: content});
    if(!is_binding_mode) r.toMessage();
    logSpirit(name, is_binding_mode, spell_slot);
}
let Trust = async ( { is_binding_mode, spell_slot } ) => {
    let name =  "Trust";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "While emboldened by a spirit of trust, you can help your allies through cooperative spellcasting.";
    content += GetDiscriptionHTML(Description);
    content += GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    let Usage = `While Trust is bound, when you finish a long rest you can choose a number of spells from the witch spell list equal to the spirit's level. You and friendly creatures within 30 feet of you of you know these spells, and always have them prepared, and they don't count against the number of spells an affected creature can know or prepare.`;
    let Effect = "";
    let Formula = "";
    let Result = "";
    if(is_binding_mode){
        Effect = `You and allies within 30ft gain spells of your choice from the witch spell list after a long rest.`;
        Formula = `Number of spells = the spirit's level`;
        Result = `Number of spells = (${spell_slot})`;
    } else {
        Usage = `You can release Trust when you take the Help action, as part of that action. When the target makes the attack roll or ability check that you aided, it can reroll one of the dice once.`;
        Effect = `Target gets a free reroll on an attack roll or ability check that you aided with Help action`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(is_binding_mode){
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Valor = async ( { is_binding_mode, spell_slot } ) => {
    let name =  "Valor";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    let Description = "Spirits of Valor give those who bind them the power to pull through with confidence against poor odds.";
    content += GetDiscriptionHTML(Description);
    content += GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    let Usage = `Valor is bound, you and friendly creatures within 10 feet of you have advantage on saving throws against being frightened.`;
    let Effect = "Gives advantage to you and allies within 10ft on saves against frightened effect.";
    let Formula = "";
    let Result = "";
    if(!is_binding_mode){
        Usage = `When you release this spirit as a bonus action, you and a number of creatures equal to the spirit's level that you can see within 30 feet of you are no longer frightened.`;
        Effect = `You and chosen creatures within 30ft are no longer frightened.`;
        Formula = `Number of creatures = the spirit's level`;
        Result = `Number of creatures = (${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(!is_binding_mode){
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}
let Wonder = async ( { is_binding_mode, spell_slot } ) => {
    let name =  "Wonder";
    let Description ="You radiate an aura of awe when a spirit of Wonder is bound to you.";
    let content = GetFlavorHTML(actor.name, name, is_binding_mode, spell_slot);
    content += GetDiscriptionHTML(Description);
    content += GetModeHTML((is_binding_mode? "Binding" : "Releasing") + ".");
    let Usage = `While Wonder is bound, creatures of your choice within 30 feet of you have disadvantage on Wisdom (Perception) checks made to perceive any creature other than you.`;
    let Effect = "Curses creatures (of your choice) within 30ft with disadvantage on Wisdom (Perception) checks other than ones made to perceive you.";
    let Formula = "";
    let Result = "";
    if(!is_binding_mode){
        Usage = `You can release Wonder from your power as an action to inspire awe in a number of creatures equal to the spirit's level that you can see within 30 feet of you. A target must succeed on a Wisdom saving throw against your spell save DC or be incapacitated and have a speed of 0 until the end of your next turn.`;
        Effect = `Chosen creatures within 30ft become incapacitated and have a speed of 0 until the end of your next turn unless they succeed on a Wis save.`;
        Formula = `Number of creatures = the spirit's level`;
        Result = `Number of creatures = (${spell_slot})`;
    }
    content += GetUsageHTML(Usage);
    content += GetEffectHTML(Effect);
    if(!is_binding_mode){
        content += GetFormulaHTML(Formula);
        content += GetResultHTML(Result);
    }
    await ChatMessage.create({content: content});
    logSpirit(name, is_binding_mode, spell_slot);
}

const spirit_funcs = [
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
];

////////////////////////////////////////////
//-----------MAIN FUNCTIONALITY-------------
////////////////////////////////////////////

function GetFlavorHTML(name, spirit, binding, slot){
    if(binding) return WrapParagraphTags(`${name} united with a <strong>level ${slot} ${spirit}</strong> spirit!`);
    return WrapParagraphTags(`${name} released the <strong>level ${slot} ${spirit}</strong> spirit!`);
}
function GetDiscriptionHTML(message){
    return WrapParagraphTags(`<strong>Description: </strong>${message}`);
}
function GetModeHTML(message){
    return WrapParagraphTags(`<strong>Mode: </strong>${message}`);
}
function GetEffectHTML(message){
    return WrapParagraphTags(`<strong>Effect: </strong>${message}`);
}
function GetUsageHTML(message){
    return WrapParagraphTags(`<strong>Usage: </strong>${message}`);
}
function GetFormulaHTML(message){
    return WrapParagraphTags(`<strong>Formula: </strong>${message}`);
}
function GetResultHTML(message){
    return WrapParagraphTags(`<strong>Result: </strong>${message}`);
}
function WrapParagraphTags(message){
    return `<p>${message}</p>`
}

async function updateSpiritBoxJournal(journalEntryId) {
    const spiritBox = GetSpiritBox();

    let content = `<h2>Spirit Box Status</h2>`;
    content += `<table><tr><th>Spirit</th><th>Status</th><th>Level</th></tr>`;

    for (const [spiritName, level] of Object.entries(spiritBox)) {
        const status = level ? `Bound (Level ${level})` : "Unbound";
        content += `<tr><td>${spiritName}</td><td>${status}</td><td>${level || "-"}</td></tr>`;
    }

    let JournalEntrypage = game.journal.getName(journalEntryId).pages.getName(journalEntryId);
    if (!JournalEntrypage) {
        console.error(`Journal entry page with name ${journalEntryId} not found.`);
        return;
    }

    await JournalEntrypage.update({ 
        text: {
            content: content
        }
    });
    console.log("Spirit Box Journal updated successfully.");
}


async function CastSpell(spell_level, spirit_name, binding, spirit_func){
    const override = actor.system.spells[spell_level].override;
    const max = actor.system.spells[spell_level].max;
    const value = actor.system.spells[spell_level].value;
    if(binding){
        await actor.update({
            [`system.spells.${spell_level}.override`] : override ? max - 1 : override - 1,
            [`system.spells.${spell_level}.value`] : value - 1,
        });
        await UpdateSpirit(spirit_name, actor.system.spells[spell_level].level, binding);
    } else {
        await actor.update({
            [`system.spells.${spell_level}.override`] : override ? max + 1 : override + 1,
            [`system.spells.${spell_level}.value`] : value + 1,
        });
        await UpdateSpirit(spirit_name, actor.system.spells[spell_level].level, binding);
    }
    spirit_func({ is_binding_mode: binding, spell_slot: actor.system.spells[spell_level].level });
    await updateSpiritBoxJournal(JOURNAL_ENTRY_ID);
}

Main();
async function Main() {

    let spirits = GetSpiritBox();
    if(spirits === undefined) spirits = await FlagInitializer();

    ////////////////
    //--------------------------------------- BIND DIALOG
    ////////////////

    let slots_options_text = "";
    for (let spell_level in actor.system.spells) {
        if(spell_level == "pact") continue;
        if (actor.system.spells[spell_level].value > 0){
            slots_options_text += `<option value="${spell_level}">spell level ${actor.system.spells[spell_level].level} : (${actor.system.spells[spell_level].value}) available slots</option>`;
        }
    }

    let spirits_options_text = "";
    for(let [spirit_name, level] of Object.entries(spirits)){
        if(!level) spirits_options_text += `<option value="${spirit_name}">${spirit_name}</option>`;
    }

    let content = `
    <div class="form-group">
        <label>Choose the spirit's Level</label>
        <div class="form-fields">
            <select name="slot_level">` + slots_options_text + `</select>
        </div>
    </div>

    <div class="form-group">
        <label>Choose a spirit to bind with you</label>
        <div class="form-fields">
            <select name="spirit_name">` + spirits_options_text + `</select>
        </div>
    </div>`;

    let binding_dialog = new foundry.applications.api.DialogV2({
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
            CastSpell(spell_level, spirit_name, binding = true , spirit_func);
        }
    });

    ////////////////
    //--------------------------------------- RELEASE DIALOG
    ////////////////

    let options_text ="";
    for(let [spirit_name, level] of Object.entries(spirits)){
        if(level) options_text += `<option value="${spirit_name}">${spirit_name} level ${level}</option>`;
    }

    content = `
    <div class="form-group">
        <label>Choose a spirit to sever your bond with</label>
        <div class="form-fields">
            <select name="spirit">` + options_text + `</select>
        </div>
    </div>`;

    let releasing_dialog = new foundry.applications.api.DialogV2({
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
            CastSpell(spell_level, spirit_name, binding = false , spirit_func);
        }
    })

    ////////////////
    //--------------------------------------- MAIN DIALOG
    ////////////////

    let options = "";
    [1,2,3,4,5].forEach(count => {
        options += `<option value="${count}">${count}</option>`;
    });

    content = `
    <form id="binding-rites-form">
        <div class="form-group">
            <p>` + game.i18n.format("DND5E.AbilityUseHint", {name: "Binding Rites", type: "spell"}) + `</p>
        </div>
        <div class="form-group">
            <label>Select current maximum bonds (required for binding spirits)</label>
            <div class="form-fields">
                <select name="bonds">` + options + `</select>
            </div>
        </div>
    </form>`;

    await new foundry.applications.api.DialogV2({
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
                if (GetSpiritsCount() == 0)
                    return SendErrorMsg("Your character isn't united with any spirits");
                releasing_dialog.render({ force: true });
            } else {
                if (GetSpiritsCount() > max_bonds)
                    return SendErrorMsg(`Current spirit count (${GetSpiritsCount()}) is higher than entered maximum bonds (${max_bonds}). Please select a valid number!`)
                if (!hasAnyAvailableSlot())
                    return SendErrorMsg("Your character doesn't have any spell slots left");
                binding_dialog.render({ force: true });
            }
        }
    }).render({ force: true });
}
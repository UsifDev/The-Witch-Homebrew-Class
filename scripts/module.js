import SpiritBindingRites from './spirit-binding-rites.js';

Hooks.once('init', async function() {
    SpiritBindingRites.init();
});

Hooks.once('ready', async function() {
    SpiritBindingRites.ready();
});

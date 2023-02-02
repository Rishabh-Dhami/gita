# Shortcut.js

`Shortcut.js` is a JavaScript ES6 component that offers a global keyboard event handler. This way one can declare and react to any combination of keys. It also offers several useful methods to manipulate those registered keyboard events.
With ~5Ko minified, `Shortcut.js` is designed to be stable and remain as light as possible. It is meant to be used application wide so all your components can react to keyboard events.

# Get Started

Here's an example on how to create a custom event handler :

```javascript
/* Import the Js component */
import Shortcut from 'shortcut.js';
/* Create a basic shortcut handler */
const myShortcutHandler = new Shortcut();
/* ...Or, you can provide several options to customize the handler */
const myShortcutHandler = new Shortcut({
  keyEvent: 'keydown', // 'keydown' or 'keyup' or 'keypressed'
  autoRepeat: true, // If key is kept pushed, do event have to repeat ?
});
```

If you want to update the shortcut handler options, you can use `updateKeyEvent(string)` or `updateAutoRepeat(boolean)`.
The handler is now ready to register and react to keyboard events.

## Register a keyboard event

To register a keyboard event, you must call the `register` method and give it a string for the key to listen (case insensitive), and a callback to fire each time it is pressed.

```javascript
myShortcutHandler.register('F', () => {
  alert('Pay respect');
});
```

When declaring a multi key event, all modifiers must be placed before the actual key, meaning the actual key is the last character of the string (also case insensitive). The `+` char in the following example is used for clarity but is not mandatory. One can use the following modifiers : `ctrl`, `alt`, `shift`. There is no modifiers order to respect.

```javascript
myShortcutHandler.register('Ctrl+Alt+Shift+F', () => {
  alert('Pay triple respect');
});
```

If you want to register an event with a key that is neither a letter or a number, you must use the `event.key` value. For references, use the [MDN sandbox](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key#result) so you can find the `event.key` for your shortcut.

## Manipulate a keyboard event

You can also control those events to pause or resume them on demand.

```javascript
// Pause a keyboard event using its definition string
myShortcutHandler.pause('F');
myShortcutHandler.pause('Ctrl+Alt+Shift+F');
// Resume it using its definition string
myShortcutHandler.resume('F');
myShortcutHandler.resume('Ctrl+Alt+Shift+F');
// ...Or use the global pause/resume method
myShortcutHandler.pauseAll();
myShortcutHandler.resumeAll();
```

To remove the listener of this keyboard event, simply use the following methods.

```javascript
// Remove a keyboard event using its definition string
myShortcutHandler.remove('Ctrl+Alt+Shift+F');
// ...Or, remove all subscribed keyboard events
myShortcutHandler.removeAll();
```

You're now good to go!

This example is one of the React Grid Layout Demos. 
Demo 0 shows basic RGL functionality and how to use static elements, which are not moveable or resizeable. 
This example folder also includes an alternative app which can be run. 
AlternativeApp.tsx is similar to one of the basic RGL examples, but just written in a slightly different way.
Recompiling when the app is running appears to break the ability to move and resize.

To run:
```bash
npm -i
npm start
```



To change which app to run:
in src/index.tsx, the line that says
```js
import App from "./App";
```

should be changed to
```js
import App from "./AlternativeApp";
```

The alternative app uses the droppable-element class name. More information about droppable-element can be found RGL Demo 15.


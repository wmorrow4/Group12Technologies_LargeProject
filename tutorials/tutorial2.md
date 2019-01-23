### Tutorial 2 - Building, Editing HTML and Running

The build instructions I initially posted are now a little different as we evolve the project. We're leaving behind yarn and simply using gulp and node directly.

So to build the project and see changes you've made in the "src" directory, simply type "gulp" and hit enter. This will compile the necessary assets and copy the results over to the "dist" directory.

Once you've built the project you can run it by typing:

node dist/server/index.js

This should output the following text:

Server started on port 8080...

This means the server is running.

Open a browser (inside the VM) and go to http://localhost:8080 to see your changes take effect.

In the terminal window with the server running, press CTRL+C to stop the server process.

Edit "src/assets/pages/index.html" and change some text.

Edit "src/assets/js/app.js" and add some code.

Edit "src/assets/scss/app.scss" or "src/assets/scss/_settings.scss" and change some settings or add some css classes.

Rerun "gulp" and "node dist/server/index.js"

Open a browser and observe your changes.
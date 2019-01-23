### Tutorial 1 - Directory Structure

At the end of this tutorial you should be able to make modifications to HTML and CSS on the project yourself.

Familiarize yourself with the project directory structure. These are very common project templates now-a-days. At the root of the project directory is a src and dist directory (among other things). The "src" directory is where the source files go. The "dist" directory is where the actual files go that we serve up in the web server.

src/assets: This directory is where static assets like javascript, images and scss (note I didn't say css) files go

src/assets/js: javascript files go here.

src/assets/scss: Sass files go here (more on that later)

src/assets/img: image files go here.

src/layouts, src/pages, and src/partials: These three directories work together to provide the HTML files that the web server will serve. This project uses a template module called "handlebars" that neatly stitches HTML documents together using templates.

src/layouts: This directory contains the outer part of the template. Any change you make here will affect **EVERY** page that uses that layout. We only have a default layout called "default.html" If you open that file, you'll notice all it has is the HTML, BODY tags etc, but no real content.

src/pages: This directory contains content that will be embedded inside layouts, but for all practical purposes is the **page** itself. Notice there is one called "index.html" and that it's missing the HTML, BODY, SCRIPT tags etc. That's because it will get merged into the default layout during build time to produce the final "index.html" file over in the "dist" directory.

src/partials: We can ignore this directory for now. What partials let you do is define some common HTML that you want to use everywhere (like a dialog or a loading spinner or something) If you define it as a partial you can easily embed it and reuse it all over your web app.

src/server: This is a directory I manually added. This is where we'll be putting the actual back end server code.

src/server/controllers: This is another directory I manually added. This is where the "controllers" for the REST API will be placed. More to come on that later as well.

src/assets/swagger.json: This is the REST API spec file. More to come on this as well.
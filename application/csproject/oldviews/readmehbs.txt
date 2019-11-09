Ok, this is what all of these .hbs files are about.
Basically, just imagine them as HTML files that we are rendering serverside.

Most of these files have (mostly) HTML in them, and all of this gets coded and compiled into actual HTML, which then gets served up to the browser.

The reason why we use .hbs files, is becaause of the {{}} brackets.
Notice how it looks like it's just "receiving" data?

That's because it is. Look in routes.js and you will see more explanation of what is being sent into these .hbs files and how.

That's why all this stuff is here and not just in regular HTML files. Because we can send data directly to thse files with javascript, and then handlebars will help us render that data to the actual webpage.

Express already has a "view engine" built into it. Handlebars is a template (view) sengine.
So express already knows what handlebars is, and if you tell it to use a view engine (we did in app.js), it will automatically detect these .hbs files.

What express does, is start with layout.hbs automatically.
When you go to our site eg. oursite.com, you are actually loading the HTML compiled by handlebars from layout.hbs

{{body}} in layout.hbs, will change when we click on different routes.
eg. oursite.com/suraj loads suraj.hbs into the {{{body}}} portion of layout.hbs

So this is basically a single page app.

So we would have like /login /shop /find, etc. built into our app later into .hbs files, and they will all load into the {{body}} portion of layout.hbs.

We can't really change that, and shouldn't since it woudl require very deep digging and will definitely cause bugs.

For now, we can just accept that express and node "magically" show us layout.hbs, "magically" loads the other .hbs files into the {{{body}}} section, and automatically knows how to convert that into straight html for our app.

Thanks,
-Greg

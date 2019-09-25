This is the public folder.
Everythign in here is "static" and is accessible by all of the .hbs files.
Eg. images, css, javascript that we use client side will all just go in here.

For example, for an image you would do.
<img src="url"> </img>

Because we can store images in here, and the app can see it, we would be able to load images like this:
<img src="/images/image.jpg"></img>

We can skip the /public part, because that is included.
To see where and how we are including these static files, look in app.js and I will have comments there.

-Greg

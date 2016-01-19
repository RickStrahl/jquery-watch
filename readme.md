# jquery-watch 
#### A jQuery plug-in to notify you of CSS, Attribute or Property changes in an element 

This small jQuery plug-in allows you to monitor changes to any DOM element's CSS styles, attributes or properties and fires a callback in response to any change in the monitored styles or attributes.

You can specify an element and any number of CSS properties attribute or property names you want to monitor and if any of them are changed you are notified of the change via a function delegate you provide. The function delegate receives an object with an array of property names and current values, plus an index for the one that triggered the change.

### Related Resources

* **[Blog Post about jquery-watch](http://weblog.west-wind.com/posts/2014/Oct/20/A-jquerywatch-Plugin-for-watching-CSS-styles-and-Attributes)**
* **[Online Sample](http://samples.west-wind.com/jquery-watch/)**

## Installation
To install jquery-watch either copy the jquery-watch scripts out of the root folder of this repository, or use Bower or NPM to install it into your project:

    $ Bower install jquery-watch-dom

Note the differing name (jquery-watch-dom rather than jquery-watch) for the Bower package due to a naming conflict with an existing bower package.

	$ npm install jquery-watch 

## Usage
To use the plugin add a reference to jQuery and a reference to this plugin to your page:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="scripts/jquery-watch.min.js"></script>
```

To hook up an element for monitoring in script code use:

```javascript
// some element to monitor
var el = $("#notebox");

// hook up the watcher
el.watch({
    // specify CSS styles or attribute names to monitor
	properties: "top,left,opacity,attr_class,prop_innerHTML",

    // callback function when a change is detected
    callback: function(data, i) {
		var propChanged = data.props[i];
        var newValue = data.vals[i];
	
		var el = this;
		var el$ = $(this);

        // do what you need based on changes
        // or do your own checks
	}
});
```
You simply specify the CSS styles or attributes to monitor and then hook up a call back function, and wait for change notifications to come in.

Note that you can get quite a lot of notifications especially if you're monitoring things like opacity during a fade operation or top/left during drag operations, so you should keep the code in this function to a minimum.

### Watching Property and Content Changes
You can also monitor property changes by watching any direct properties that are associated with a given jQuery DOM element set.

For example assume you have a button that changes some text in a DOM element:

```html
<button id="btnChangeContent">Change Content</button>
<div id="SomeContent">Some Content that can change.</div>
```

To capture the programmatic change you can now use the following code:

```javascript
$("#btnChangeContent").click(function () {
    // assign text programmatically
    $("#SomeContent").text("Hello - time is " + new Date());
});
// watch the content
$("#SomeContent").watch({
    properties: "prop_innerHTML",
    watchChildren: true,
    callback: function (data, i) {
        console.log("text changed");
        alert('text changed' + data.vals[i]);
    }
});
```

Whenever you click the button and the text is changed an alert box pops up from the watcher notification.

## Syntax
The syntax uses standard jQuery plug-in behavior attached to an element selector:

```javascript
$("#Element").watch(options)
```

where options looks like this:

```javascript
var options = {
    // CSS styles or Attributes to monitor as comma delimited list
    // For attributes use a attr_ prefix
    // Example: "top,left,opacity,attr_class,prop_innerHTML"
    properties: null,

    // interval for 'manual polling' (IE 10 and older)            
    interval: 100,

    // a unique id for this watcher instance
    id: "_watcher",

    // flag to determine whether child elements are watched            
    watchChildren: false,

    // Callback function if not passed in callback parameter   
    callback: null
}
```

The main required property to set is `properties` which can contain any CSS Style property (top, left, opacity, display etc.), an attribute name prefixed by `attr_` (attr_class,attr_readonly,attr_src etc.) or a property name prefixed by `prop_' (prop_innerHTML, prop_value etc). `attr_` and `prop_` use jQuery's attr() and prop() functions respectively to check the relevant keys.

The other required property is the `callback` property which lets you specify a callback function called when one (or more) of the properties change.  The callback function receives two parameters which is an instance of a data object that contains an array of the properties monitored and the latest values.

An implementation of the callback function looks like this:

```javascript
function changeCallback(data, i) {
	// data object and index into the arrays
    var changedProperty = data.props[i];
    var newValue = data.vals[i];
    
    // this is the element affected
    var el$ = $(this)

    //... do your logic
}
```

If you only care to be notified and you don't care about changed or updated values, you can ignore the parameters - which is actually quite common. In that case you can do your own checks in your code to find what's changed or update other properties as needed.

If you want to know which element caused the event to fire you can use the code shown above to retrieve the `changedProperty` and `newValue` for property.

> Note that the change event tracking is turned off for the duration of the callback function execution to avoid recursive events firing causing a potential browser lockup. If you need to make changes that require updating the DOM that affect further change events, you should use `setTimeout()` to delay execution until after the callback has completed.


## Example Usage
As an example consider you have a couple of HTML elements - two boxes and you want to slave one box to the other:

```html
<div class="container">
    <div id="notebox" class="notebox">
        <p>
            This is the master window. Go ahead drag me around and close me!
        </p>
        <p>
            The shadow window should follow me around and close/fade when I do.
        </p>
        <p>
            There's also a timer, that fires and alternates a CSS class every
            3 seconds.
        </p>
    </div>

    <div id="shadow" class="shadow">
        <p>I'm the Shadow Window!</p>
        <p>I'm shadowing the Master Window.</p>
        <p>I'm a copy cat</p>
        <p>I do as I'm told.</p>
    </div>
</div>
```
There are two boxes #notebox and #shadow and what we want to do is monitor changes on #notebox and affect the behavior of #shadow to keep #shadow tied and synched to the #notebox. 

The following code monitors #notebox so we can tell when a monitored value is changed:

```javascript
var el = $("#notebox");
el.draggable();

// Also update a CSS Class on a 3 sec timer
var state = false;
setInterval(function () {
    $("#notebox")
        .removeClass("class_true")
        .removeClass("class_false")
        .addClass("class_" + state);
    state = !state;
}, 3000);


// Hook up CSS and Class watch operation
el.watch({
    properties: "top,left,opacity,attr_class",
    callback: watchShadow
});

// this is the handler function that responds
// to the events. Passes in:
// data.props[], data.vals[] and an index for active item
function watchShadow(data, i) {
    // you can capture which attribute has changed
    var propChanged = data.props[i];
    var valChanged = data.vals[i];

    // element affected is 'this'
    var el = $(this);
    var sh = $("#shadow");

    // get master current position
    var pos = el.position();
    var w = el.outerWidth();
    var h = el.outerHeight();

    // and update shadow accordingly
    sh.css({
        width: w,
        height: h,
        left: pos.left + w + 4,
        top: pos.top,
        display: el.css("display"),
        opacity: el.css("opacity")
    });

    // Class attribute is more tricky since there are
    // multiple classes on the parent - we have to explicitly
    // check for class existance and assign
    sh.removeClass("class_true")
        .removeClass("class_false");
    if (el.hasClass("class_true"))
        sh.addClass("class_true");
}
``` 

When you run this code you'll essentially see #shadow follow around the #notebox when dragged or moved, fade out when the #notebox fades. You'd also see the CSS class of #shadow changed every three seconds, in response to the change on #notebox.

Note that the code above doesn't actually rely on the parameters passed into the `watchShadow` function, but instead does its own checks to see what needs updating. In fact this code simply updates all relevant properties whether they have changed or not. While less efficient it allows for simpler code and depending on how much change you need to do on the DOM, this can be very fast regardless. Your mileage may vary. If you have larger changes you need to affect, using the specific property to update the UI might be more appropriate.

### Watching Child Elements
You can also monitor changes to child nodes by setting `.watchChildren` to `true` and then looking at the mutation record to figure out if nodes have been removed or added:

```javascript
$list.watch({
        properties: 'prop_innerHTML',
        watchChildren: true,
        callback: function (data, i, mutations) {

            mutations.forEach(function(record) {
                if (record.type === 'childList' && record.removedNodes.length > 0) {
                    console.info('removed item');        
                } else if (record.addedNodes.length > 0) {
                    console.info('added item');
                }
            });
        }
    });
```    

## Browser Support
This plug-in will work with just about any browser, as it has a fallback for legacy browsers using interval polling. Modern browsers use an efficient API to get notified of changes by the browser.

This plug-in relies on the `MutationObserver` API in modern browsers to detect change events on elements. This API is supported in all current versions of Chrome, Mozilla, Safari, Safari iOS, and Internet Explorer 11. 

Older versions of IE (10 and older) and any old browser that doesn't support `MutationObserver` can still work by using an inefficient `setInterval()` polling mechanism. It works, but there's always a slight, configurable delay between events being detected and the callback executing. However this fallback should work in any browser and so provides backwards compatibility. You can adjust the polling delay (default is 10ms), but you'll want to be careful to not poll too frequently to avoid slowing down browser operation especially on slower/older devices/machines.

## License
Licensed under the MIT License. There's no charge to use, integrate or modify the code for this project. You are free to use it in personal, commercial, government and any other type of application.

All source code is copyright West Wind Technologies, regardless of changes made to them. Any source code modifications must leave the original copyright code headers intact.

### Warranty Disclaimer: No Warranty!

IN NO EVENT SHALL THE AUTHOR, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE THIS PROGRAM AND DOCUMENTATION, BE LIABLE FOR ANY COMMERCIAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE PROGRAM INCLUDING, BUT NOT LIMITED TO, LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR LOSSES SUSTAINED BY THIRD PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS, EVEN IF YOU OR OTHER PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

## Change Log

#### Version 1.20
* **Add NPM Install**  
You can now install jquery-watch from NPM in addition to bower using `npm install jquery-watch`

* **Allow for multiple watch handlers on a single DOM element**
Fixed behavior to allow multiple watchers on a single DOM element by assigning a unique ID to the stored state for the watcher. This means multiple calls to `.watch()` can be made and all of them will trace their own properties and fire their own events.

#### Version 1.16
* **Make default Watcher ID a unique ID**<br/>
Changed the default id assignment that the watcher attaches to a unique ID which allows for multiple watcher attachments to the same element by default. Previously it was your responsibility to create new unique Ids if multiple watchers are used. You can now receive multiple events firing when attaching watchers to the same element more than once.

### Version 1.15
* **Bug Fix: Options parameter passing**<br/>
Fixed issue where the options.interval was not properly passed which caused problems for non-recent and IE-old browser that don't support MutationObservers.

* **Add support for Property watches with _prop Prefix**<br/>
You can now attach to property change values by prefixing a property name with `prop_`. So if you want to monitor a value change on an input box you can add `prop_value` or if you want to monitor the content of an element or container watch `prop_innerHTML`.


# jquery-watch 
#### A jQuery plug-in to notify you of CSS or Attribute changes in an element ####

This small jQuery plug-in can help monitor changes to any DOM element CSS classes or attributes on an element. You can specify an element and any number of CSS properties or attribute names you want to monitor and if any of them are changed are notified of the change via a function delegate you provide.

The function delegate receives an instance of the plug-in and an index into the property/value array that holds both the old and new values that allow you to update values as needed.

### Syntax ###

	$("#Element").watch("top,left,height,width,opacity,attr_class",
                        function(

This library came about as part of the following blog post:
* **[JavaScript JSON Date Parsing and real Dates](http://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates)**

This library provides:

* **JSON.dateParser**<br/>
  JSON parser extension that can be used with JSON.parse() 
  to parse dates with explicit calls to JSON.parse().

* **JSON.parseWithDate()**<br/>
  Function to provide a wrapper function
  that behaves like JSON.parse() but parses dates.

* **JSON.useDateParser()**<br/> 
  Globally replace JSON.parse() with
  JSON.parseWithDates to affect all JSON.parse() operations within
  the current page/scope. Affects all JSON operations including 
  framework JSON parsing such as jQuery.getJSON() etc.

* **JSON.dateStringToDate()**<br/> 
  Safely converts JSON ISO and MSAJAX
  dates, raw ISO and MSAJAX string values and dates to JavaScript
  dates. This function is a simple helper to guarantee you get a 
  date value regardless of which format the date is in with an optional
  override to return a known value if the date can't be resolved.

##Usage##

###JSON.parseWithDate###
Manual JSON parsing with automatic date conversion:

```javascript
var date = new Date();
var json = JSON.stringify(date);

var date2 = JSON.parseWithDate(json);
console.log(date2);   // date: Wed Jan 01 2014 13:28:56 GMT-1000 (Hawaiian Standard Time) 
```

Likewise you can apply that to complex objects that contain dates:

```javascript
var obj = {
    id: "141923asd1",
    name: "rick",
    entered: new Date(),
    updated: new Date()
};
var json = JSON.stringify(obj);

var obj2 = JSON.parseWithDate(json);

equal(!obj2.entered.getTime, false, "Date should be a date object");
equal(obj2.entered.toString(), obj.entered.toString(), "Dates should be equal");
```


###JSON.useDateParser###
useDateParser() can globally replace the JSON.parse() function with the
JSON.parseWithDate() function, which results in automatically converting dates
for all JSON operations on the global scope. This allows automatic conversions
for all subsequent JSON.parse() calls including those inside of frameworks.

```javascript
// enable global JSON date parsing
JSON.useDateParser();
       
var date = new Date();
var json = JSON.stringify(date);

// using just plain JSON.parse() should decode dates
var date2 = JSON.parse(json);
console.log(date2);

equal(!date2.getTime, false, "Date should be a date object");
equal(date2.toString(), date.toString(), "Dates should be equal");

// optionally replace original parser
JSON.useDateParser(false);
```

The following example demonstrates using $.getJSON() with automatic
date conversion:

```javascript
// enable global JSON date parsing
JSON.useDateParser();    

$.getJSON("JsonWithDate.txt")
    .done(function(data) {
        console.log("jquery result.entered: " + data.entered +
            "  result.updated: " + data.updated);

        equal(!data.entered.getTime, false, "Entered should be a date");            
    })
    .success(function () {        
        // Optionally replace original parser
        JSON.useDateParser(false);
    });
```

###JSON.dateParser###
dateParser is the JSON parse extension that is used to filter dates from
date strings. You can use this filter directly with JSON.parse() although
I'd recommend you use JSON.parseWithDate() instead.

```javascript
var obj = {
    id: "141923asd1",
    name: "rick",
    entered: new Date(),
    updated: new Date()
};
var json = JSON.stringify(obj);

var obj2 = JSON.parse(json, JSON.dateParser);

console.log(obj2.entered,obj2.updated);
```

###JSON.dateStringToDate###
dateStringToDate reliably provides JavaScript dates from JSON dates strings,
plain strings in ISO or MS AJAX formats or dates. Useful when you are not
converting JSON dates automatically and you need to be sure you always get
consistent date values in code.

All of the following should produce a date:

```javascript
var date = new Date();
var json = JSON.stringify(date);

// JSON date
var date2 = JSON.dateStringToDate(json);
console.log(date2);  

// string ISO date
date2 = JSON.dateStringToDate("2014-01-01T13:13:34.441Z");
console.log(date2);

date2 = JSON.dateStringToDate("2014-01-01T13:13:34.441Z");
console.log(date2);

// real date - just echoed back
date2 = JSON.dateStringToDate(new Date());
console.log(date2);
```
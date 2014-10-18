(function($, undefined) {
    $.fn.watch = function(props, func, interval, id) {
        /// <summary>
        /// Allows you to monitor changes in a specific
        /// CSS property of an element by polling the value.
        /// when the value changes a function is called.
        /// The function called is called in the context
        /// of the selected element (ie. this)
        ///
        /// Uses the MutationObserver API of the DOM and
        /// falls back to setInterval to poll for changes
        /// for non-compliant browsers (pre IE 11)
        /// </summary>    
        /// <param name="prop" type="String">CSS Properties to watch sep. by commas
        /// You can also prefix attr_ to monitor attribute changes. So attr_class
        /// will detect if the class attribute has changed.
        /// </param>    
        /// <param name="func" type="Function">
        /// Function called when the value has changed.
        /// </param>    
        /// <param name="interval" type="Number">
        /// Optional interval for browsers that don't support the MutationObserver API        
        /// Determines the interval used for setInterval calls.
        /// </param>
        /// <param name="id" type="String">A unique ID that identifies this watch instance on this element</param>  
        /// <returns type="jQuery" /> 
        if (!interval)
            interval = 100;
        if (!id)
            id = "_watcher";

        return this.each(function() {
            var el = this;
            var el$ = $(this);
            var fnc = function (p1, p2, p3, p4) {
                console.log(p1, p2, p3, p4);
                __watcher.call(el, id);
            };

            var data = {
                id: id,
                props: props.split(","),
                vals: [props.split(",").length],
                func: func,
                fnc: fnc,
                origProps: props,
                interval: interval,
                intervalId: null
            };
            // store initial props and values
            $.each(data.props, function(i) { data.vals[i] = el$.css(data.props[i]); });

            el$.data(id, data);

            hookChange(el$, id, data);
        });

        function hookChange(element$, id, data) {
            element$.each(function() {
                var el$ = $(this);

                if (window.MutationObserver) {
                    var observer = el$.data("__watcherObserver");
                    if (observer == null) {
                        observer = new MutationObserver(data.fnc);
                        el$.data("__watcherObserver", observer);
                    }
                    observer.observe(this, {
                        attributes: true,
                        subtree: false,
                        childList: true,
                        characterData: true
                    });
                }
                else
                    data.intervalId = setInterval(data.fnc, interval);
            });
        }

        function __watcher(id) {

            var el$ = $(this);
            var w = el$.data(id);
            if (!w) return;
            var el = this;

            if (!w.func)
                return;

            // unbind to avoid recursion
            el$.unwatch(id);

            var changed = false;
            var i = 0;
            for (i; i < w.props.length; i++) {
                var key = w.props[i];

                var newVal = "";
                if (key.startsWith('attr_'))
                    newVal = el$.attr(key.replace('attr_', ''));
                else
                    newVal = el$.css(key);

                if (newVal == undefined)
                    continue;

                if (w.vals[i] != newVal) {
                    w.vals[i] = newVal;
                    changed = true;
                    break;
                }
            }
            if (changed)
                w.func.call(el, w, i);

            // rebind event
            hookChange(el$, id, w);
        }
    }
    $.fn.unwatch = function(id) {
        this.each(function() {
            var el = $(this);
            var data = el.data(id);
            try {
                if (window.MutationObserver) {
                    var observer = el.data("__watcherObserver");
                    if (observer) {
                        observer.disconnect();
                        el.removeData("__watcherObserver");
                    }
                } else
                    clearInterval(data.intervalId);
            }
            // ignore if element was already unbound
            catch (e) {
            }
        });
        return this;
    }
    String.prototype.startsWith = function (sub) {                        
        if (this.length == 0) return false;        
        return sub == this.substr(0, sub.length);
    }
})(jQuery,undefined);
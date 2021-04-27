var Bean, Instance, Lifecycle, List;

import {
  ChildAppender
} from "htmlhammer";

// Mixin defining Bean's lifecycle methods
// Used internally by the framework and not
// intended to be used by the developers
Lifecycle = class Lifecycle {
  // Define a set of action right after
  // Bean instance has been all setup
  postConstruct() {}

  // Define a set of actions to be excuted
  // right before html element is being
  // removed from the dom
  preDestroy() {}

};

// Core part used internally by the framework
// Not intended to be used by the developers
Instance = class Instance extends ChildAppender {
  constructor(props, fn1) {
    super();
    this.fn = fn1;
    // Reserved property which stores input properties
    // You can alway access(or store new properties)
    // input properties by using 
    // @.propertyName or @[propertyName] respectively
    // Properties are not dynamic, think of them as
    // init data
    // Props should always be given as a JSON object
    this.props = {};
    this.childBeans = [];
    // Apply Lifecycle mixin
    Object.assign(this, Lifecycle);
    // Store input properties
    // If props is not an object, it is stored under
    // @props with name "value"
    if (typeof props === "object") {
      Object.assign(this.props, props);
    } else {
      this.props["value"] = props;
    }
    // Create initial html element
    // _ is reserved property for direct access 
    // to the underlying html element
    // Shorthand for @element
    this._ = this.fn(this.props);
    this.element = this._;
    this._arrayToRoot();
    if (this.postConstruct) {
      // If postConstruct is defined, call it after
      // everything on this Bean instance has been setup
      this.postConstruct();
    }
  }

  // Removes element from the dom
  // Bean elements should always be removed
  // using this method if there were any
  // kind of subscriptions or event listeners set
  remove(preserveRoot = false) {
    var ref, ref1;
    // If preDestroy is defined
    // call it before removing element
    // from the dom
    if (this._) {
      if (this.preDestroy) {
        this.preDestroy();
      }
      if ((ref = this.childBeans) != null) {
        ref.forEach(function(bean) {
          var b, i, len, results;
          if (!Array.isArray(bean)) {
            return bean.remove();
          } else {
            results = [];
            for (i = 0, len = bean.length; i < len; i++) {
              b = bean[i];
              results.push(b.remove());
            }
            return results;
          }
        });
      }
      if (!preserveRoot) {
        if ((ref1 = this._) != null) {
          ref1.remove();
        }
        return Object.keys(this).forEach((key) => {
          return delete this[key];
        });
      }
    }
  }

  // Use to update this bean's html element
  // from the outside
  // For update to happen, bean needs to provide
  // onUpdate method
  update(...props) {
    if (this.onUpdate && this._) {
      return this.onUpdate(...props);
    }
  }

  // Convenient shorthand method
  // for querying this element's dom
  query(selector, all = false) {
    if (all) {
      return this._.querySelectorAll(selector);
    } else {
      return this._.querySelector(selector);
    }
  }

  // Used by htmlhammer internally
  // Do not use it unless you know what you
  // are doing
  append(parent) {
    return parent.append(this._);
  }

  // For templates returning an array only one child
  // is allowed per array
  // Used internally by the framework
  // Do not use it unless you know what you
  // are doing
  _arrayToRoot() {
    if (Array.isArray(this._)) {
      if (this._.length > 1) {
        return console.error("Array can contain only one child element for now");
      } else {
        return this._ = this._[0];
      }
    }
  }

};

// Curry function used for defining beans
Bean = function(fn) {
  return function(props, parentBean) {
    var I, ref;
    I = new Instance(props, fn);
    if (parentBean != null) {
      if ((ref = parentBean.childBeans) != null) {
        ref.push(I);
      }
    }
    return I;
  };
};

// Special Bean which helps when dealing with lists
// Parameters: {data, parent, child}
// For List to work properly, child element passed to function
// needs to have onUpdate method defined which means you should create
// Bean for it or you can override List's onUpdate method in postConstruct
// method of the Bean where List will be used.
List = Bean(function() {
  var Parent;
  this.onUpdate = function(newData, index, createOnIndexOutOfBound = false) {
    var child, i, j, k, len, len1, len2, o, ref, ref1, results;
    if (index != null) {
      // Updates single item
      if (index < this.childBeans.length) {
        return this.childBeans[index].update(newData);
      } else {
        if (createOnIndexOutOfBound) {
          return Parent.append(this.props.child(newData, this)._);
        } else {
          return console.error(`No such element, index out of bound: ${index}`);
        }
      }
    } else {
      ref = this.childBeans;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        // Recreates list from scratch
        child.remove();
      }
      this.childBeans.length = 0;
      for (j = 0, len1 = newData.length; j < len1; j++) {
        o = newData[j];
        this.props.child(o, this);
      }
      ref1 = this.childBeans;
      results = [];
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        child = ref1[k];
        results.push(Parent.append(child._));
      }
      return results;
    }
  };
  return [
    Parent = this.props.parent(this.props.data.map((o) => {
      return this.props.child(o,
    this);
    }))
  ];
});

export {
  Bean,
  List
};

export * from "htmlhammer";

// Generated by CoffeeScript 2.5.1
var App, Bean, Content, Header, Li, List, button, div, h3, li, ul;

({Bean, div, button, ul, li, h3, List} = coffeebeans);

// Header component
Header = Bean(function({title}) {
  var changeTitle;
  this.preDestroy = function() {
    return console.log("Destroying Header");
  };
  this.postConstruct = function() {
    return console.log("Constructed Header");
  };
  this.onUpdate = function(props) {
    return changeTitle(props);
  };
  changeTitle = (title) => {
    return this._.textContent = title;
  };
  return div({
    class: "header",
    style: {
      backgroundColor: "lightcoral"
    },
    onclick: () => {
      return changeTitle(Math.random() + "A");
    }
  }, title);
});


// Content component
Content = Bean(function({content}) {
  this.preDestroy = function() {
    return console.log("Destroying Content");
  };
  return div(content);
});

// App component
App = Bean(function() {
  var LiList, changeContent;
  this.preDestroy = function() {
    return console.log("Destroying App");
  };
  changeContent = () => {
    while (Content._.firstChild) {
      Content._.firstChild.remove();
    }
    Content._.append(div(`Content updated! ${Math.random()}`));
    return Header.update("New title is set from the outside");
  };
  this.postConstruct = function() {
    return this.childBeans.push(Header, LiList, Content);
  };
  return div(Header = Header({
    title: this.props.title
  }), Content = Content({
    content: this.props.content
  }), button({
    onclick: changeContent
  }, "Change content"), h3("List example", LiList = List({
    data: [1, 2, 4],
    parent: ul,
    child: Li
  }), button({
    onclick: () => {
      return LiList.remove();
    }
  }, "Remove list")), button({
    onclick: () => {
      return LiList.update([3, 3, 3, 3, 3, 4, 4, 4, 4, 4]);
    }
  }, "Replace list"), button({
    onclick: () => {
      return LiList.update(9, 2);
    }
  }, "Update 3rd"));
});

Li = Bean(function() {
  this.preDestroy = function() {
    return console.log(`Destroying Li(${this.props.value})`);
  };
  this.onUpdate = function(val) {
    return this._.textContent = val;
  };
  return [li(this.props.value)];
});

export {
  App
};

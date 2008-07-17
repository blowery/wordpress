
(function(){
  var ben = {
    name: "ben",
    age: 31
  };
  
  function foo(){
    var ben = null;
    console.log("foo::ben: %o", ben);
    bar();  
  }
  
  function bar(){
    console.log("bar::ben: %o", ben);
  }
  
  foo();
})();
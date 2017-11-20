//- Using a function pointer:
document.getElementById("Submit").onclick = doFunction;

//- Using an anonymous function:
document.getElementById("Submit").onclick = function () { alert('hello!'); };

var el = document.getElementById("Submit");
if (el.addEventListener)
    el.addEventListener("click", doFunction, false);
else if (el.attachEvent)
    el.attachEvent('onclick', doFunction);
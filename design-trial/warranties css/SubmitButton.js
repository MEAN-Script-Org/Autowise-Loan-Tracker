var el = document.getElementById("Submit");
if (el.addEventListener)
    el.addEventListener("Submit", doFunction, false);
else if (el.attachEvent)
    el.attachEvent('onclick', doFunction);

//- Using a function pointer:
document.getElementById("Submit").onclick = doFunction;

//- Using an anonymous function:
document.getElementById("Submit").onclick = doFunction () { alert('hello!'); };
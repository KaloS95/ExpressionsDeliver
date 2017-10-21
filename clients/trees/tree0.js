function stampaExp()
    {
        document.getElementById("expr").innerHTML = "( 1 + 2 ) * ( 3 / 4 ) - ( 5 + 6 ) ";
    }
stampaExp();
var simple_chart_config = {
    chart: {
        container: "#tree-simple",
        rootOrientation: "SOUTH"

    },
    
    nodeStructure: {
                innerHTML: "-<br/><input id='0' type='text' onkeydown='check(event)' data-result='-8.75'/>",
        children: [
            {
        innerHTML: "*<br/><input id='4' type='text' onkeydown='check(event)' data-result='2.25'/>",
        children: [
            {
        innerHTML: "+<br/><input id='8' type='text' onkeydown='check(event)' data-result='3.0'/>",
        children: [
            {
        text: { name: 1.0 }
            },
            {
        text: { name: 2.0 }
            }
        ]
            },
            {
        innerHTML: "/<br/><input id='5' type='text' onkeydown='check(event)' data-result='0.75'/>",
        children: [
            {
        text: { name: 3.0 }
            },
            {
        text: { name: 4.0 }
            }
        ]
            }
        ]
            },
            {
        innerHTML: "+<br/><input id='1' type='text' onkeydown='check(event)' data-result='11.0'/>",
        children: [
            {
        text: { name: 5.0 }
            },
            {
        text: { name: 6.0 }
            }
        ]
            }
        ]

}};
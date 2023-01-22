import './style.css'




var text = `
var {{iterator}}= 0
for(var {{iterator}} = 0; {{iterator}} < {{ammount}}; {{iterator}}++) {
    print({{iterator}})
}
`
String.prototype.splice = function(index, count, add) {
    if (index < 0) {
        index = this.length + index;
        if (index < 0) {
            index = 0;
        }
    }
    return this.slice(0, index) + (add || "") + this.slice(index + count);
};


function replace(dictionary,text)
{
    var regex = /{{(.*?)}}/g;
    var match;
    while (match = regex.exec(text)) {
    
        var current = match[1].trim()
        if(current in dictionary)
        {
            text = text.splice(match.index, match[0].length, dictionary[current])
            regex.lastIndex = match.index
        }
    }
    return text
}



function pretty_replace(dictionary,text)
{
    function replaceKnownVariable(text, match,color,value)
    {
        return text.splice(match.index, match[0].length, (<span style={`color:${color}`}>{value}</span>).outerHTML)
    }
    function replaceUnknownVariable(text, match,color,value)
    {
        return text.splice(match.index, match[0].length, (<span style="color:gray">{"{\0{"}<span style={`color:${color}`}>{value}</span>{"}}"}</span>).outerHTML)
    }
    var text =
    text.replace(/\n/g,'<br>')
        .replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/ /g,'&nbsp;')
    var regex = /{{(.*?)}}/g;
    var match;
    while (match = regex.exec(text)) {
    
        var current = match[1].trim()
        if(current in dictionary)
        {
            text = replaceKnownVariable(text,match,"green",dictionary[current])
            regex.lastIndex = match.index
        }
        else
        {
            text = replaceUnknownVariable(text,match,"red",current)
        }
    }
    return text
}

function findVariables(text)
{
    var regex = /{{(.*?)}}/g;
    var match;
    var variables = new Set()
    while (match = regex.exec(text)) {
        variables.add(match[1])
    }
    return Array.from(variables)
}

const data = {}

const controlRef = ref()
const textRef = ref()

const main = <div>
    <div  ref={controlRef}></div>
    <div  ref={textRef}></div>
</div>

main.parent(document.body)

textRef.html(()=>pretty_replace(data,text))
controlRef.child(()=>{
    const inputContainer = <div></div>
    for(const variable of findVariables(text))
    {
        const input = ref()

        const container = 
        <div class="form-group">
            <label>{variable}</label>
            <input type="text" ref={input}></input>
        </div>
        container.parent(inputContainer)

        input
            .event("input",()=>{
                if(input.value == "")
                {
                    delete data[variable]
                }
                else
                {
                    data[variable] = input.value
                }
                textRef.update()
            })
    }
    return inputContainer
})


main.test
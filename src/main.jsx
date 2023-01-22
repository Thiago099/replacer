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
    function replaceStr(text, match,color,value)
    {
        return text.splice(match.index, match[0].length, (<span style={`color:${color}`}>{value}</span>).outerHTML)
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
            text = replaceStr(text,match,"green",dictionary[current])
            regex.lastIndex = match.index
        }
        else
        {
            text = replaceStr(text,match,"red",current)
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

const ref = {}
const main = <div>
    <div  ref={[ref,"text"]}></div>
    <div  ref={[ref,"controls"]}></div>
</div>
main.parent(document.body)

ref.text.html(()=>{
    var result = pretty_replace(data,text)
    return(
        result

    )
})

ref.controls.child(()=>{
    const inputContainer = <div></div>
    for(const variable of findVariables(text))
    {
        const input = <input type="text" placeholder={variable}></input>

        input
            .parent(inputContainer)
            .event("input",()=>{
                if(input.value == "")
                {
                    delete data[variable]
                }
                else
                {
                    data[variable] = input.value
                }
                ref.text.update()
            })
    }
    return inputContainer
})


main.test
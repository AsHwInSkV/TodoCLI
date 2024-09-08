const fs = require('fs');
const args = process.argv;
const currWd = args[1].slice(0,-7);


if(fs.existsSync(currWd+"todo.txt")===false){
    let createStream = fs.createWriteStream('todo.txt');
    createStream.end();
}
if(fs.existsSync(currWd+"done.txt")===false){
    let createStream = fs.createWriteStream('done.txt');
    createStream.end();
}

const InfoFunction = ()=>{
    const usageText = 
    `Usage :-
    $ node index.js add "todo item"  # Add a new todo
    $ node index.js ls               # Show remaining todos
    $ node index.js del NUMBER       # Delete a todo
    $ node index.js done NUMBER      # Complete a todo
    $ node index.js help             # Show usage
    $ node index.js report           # Statistics`;
    console.log(usageText);
};

const listfunction = ()=>{
    let data=[];
    let fileData = fs.readFileSync(currWd+"todo.txt").toString();
    data=fileData.split("\n");
    let filterdata = data.filter((a)=>{return a!=="";});
    if(filterdata.lenth===0){
        console.log("There are no pending tasks.");
    }
    for(let i=0;i<filterdata.length;i++){
        console.log((filterdata.length-i)+"."+(filterdata[i]));
    }
};

const addFunction = ()=>{
    const newTask = args[3];
    if(newTask){
        let data = [];
        const fileData = fs.readFileSync(currWd+"todo.txt").toString();
        fs.writeFile(currWd+'todo.txt',newTask+"\n"+fileData,
            function (err){
                if(err) throw err;
                console.log('Added todo :"'+newTask+'"');
            },
        );
    }
    else{
        console.log("Error: Missing todo string. Nothing addaed!")
    }
};

const deleteFunction = ()=>{
    const deleteIndex = args[3];
    if(deleteIndex){
        let fileData = fs.readFileSync(currWd+"todo.txt").toString();
        data = fileData.split("\n");
        let filtereddata = data.filter((val)=>{
            return val!=="";
        });

        if(deleteIndex>filtereddata.length || deleteIndex<=0){
            comsole.log('Error: todo #' + deleteIndex 
                + ' does not exist. Nothing deleted.');
        }
        else{
            filtereddata.splice(filtereddata.length-deleteIndex,1);
            let newData = filtereddata.join("\n");
            fs.writeFile(currWd+"todo.txt",newData,function(err){
                if(err) throw err;
                console.log("Deleted Todo #"+deleteIndex);
            });
        }
    }
    else{
        console.log("Error : Specify Index of Todo To Delete")
    }
    
};

const doneFunction = ()=>{
    const doneIndex = args[3];
    if(doneIndex){
        let data = [];
        let filedata = fs.readFileSync(currWd+"todo.txt").toString();
        let dateObj = new Date();
        let dateString = dateObj.toISOString().substring(0,10);
        let donedata = fs.readFileSync(currWd+"done.txt").toString();
        data = filedata.split("\n");
        let filtereddata = data.filter((a)=>{
            return a!=="";
        });
        if(doneIndex>filtereddata.length || doneIndex<=0){
            console.log("Error : Index is not available try another!")
        }
        else{
            let deletedata = filtereddata.splice(filtereddata.length-doneIndex,1);
            const newData = filtereddata.join("\n");
            fs.writeFileSync(currWd+'todo.txt',newData,function (err){
                if(err) throw err;
            });
            fs.writeFileSync(currWd+'done.txt','x'+dateString+' '+deletedata+'\n'+donedata,function (err){
                if(err) throw err;
                console.log("Marked todo #"+doneIndex+" as done.");
            });
        }
    }
    else{
        console.log("Error : Index of todo is required!");
    }
}

const reportFunction=()=>{
    let done =[];
    let todo=[];
    let tododata = fs.readFileSync(currWd+'todo.txt').toString();
    let donedata = fs.readFileSync(currWd+'done.txt').toString();
    todo = tododata.split("\n");
    done = donedata.split("\n");
    filteredTododata = todo.filter((a)=>{
        return a!=="";
    });
    filteredDonedata = done.filter((a)=>{
        return a!=="";
    });
    let dateobj = new Date();
    let dateString = dateobj.toISOString().substring(0,10);
    console.log(
        dateString+' '+'Pending : '+filteredTododata.length+'\n'+'Completed : '+filteredDonedata.length
    );
};
const clearTodos = ()=>{
    fs.writeFileSync(currWd+"todo.txt","");
    fs.writeFileSync(currWd+'done.txt',"");
    console.log("Data clear Complete!");
};

const deletefile = ()=>{
    let fileName = args[3];
    fs.stat(currWd+fileName,function(err,stats){
        if(err){ return console.log(err);}
        fs.unlink(currWd+fileName,function(err){
            if(err) console.error(err);
            console.log("File "+fileName+"deleted sucessfully!");
        });
    });
}

switch (args[2]){
    case 'add': {
        addFunction();
        break;
    }
    case 'ls':{
        listfunction();
        break;
    }
    case 'del':{
        deleteFunction();
        break;
    }
    case 'report':{
        reportFunction();
        break;
    }
    case 'done':{
        doneFunction();
        break;
    }
    case 'help':{
        InfoFunction();
        break;
    }
    case 'clear':{
        clearTodos();
        break;
    }
    case 'deletefile':{
        deletefile();
        break;
    }
    default:{
        InfoFunction();
    }

}


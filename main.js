const electron = require('electron');
const url = require('url');
const path = require ('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//listen for app to be ready

app.on('ready', function(){
    //create new window
    mainWindow = new BrowserWindow({});
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes:true
    }));

    //build menu from template 
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

//handle create add window

function createAddWindow(){
     //create new window
     addWindow = new BrowserWindow({
         width:300,
         height:200,
         title:"add shopping list item"
     });
     //load html
     addWindow.loadURL(url.format({
         pathname: path.join(__dirname, 'addWindow.html'),
         protocol:'file:',
         slashes:true
     }));
     addWindow.on("close", function(){
         addWindow = null;
     })
     //Quit App when Closed 
     addWindow.on('close', function(){
         addWindow = null;
     });
}

//catch item add

ipcMain.on("item:add", function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});
//create menu template

const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
         {
             label:'Add Item',
             click(){
                 createAddWindow();
             }
         },
         {
             label:'Clear Items',
             click(){
                 mainWindow.webContents.send('item:clear');
             }
         },
         {
             label:'Quit',
             //accelator not wokring. video tag 17:14
             //accelerator: proccess.platform == 'darwin' ? 'Command+Q' :
            //'Ctrl+Q',
             click(){
                 app.quit();
             }
         }   
      ]
    }
];

//For Mac
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//add Developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                },
              
            },
            {
            role:'reload'
            }
        ]
    });
}








/*
function createWindow(){
    //create browser window
    win = new BrowserWindow({width:800, height: 600, icon:__dirname+'/img/icon.png'});

    //laod index.html
    win.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes:true
    }));


    //open devtools
    win.webContents.openDevTools();

    win.on('closed', ()=> {
        win=null;
    })
}

app.on('ready', createWindow)

//Quit when all windows are closed 

app.on("windows-all.closed", () => {
    if(process.platform !=='darwin') {
        app.quit();
    }
});
*/

# Website Frontend for Demo Database
 because a different repo was more convenient

Hosted on projectdb.vercel.app

## TODO list
- change table logic and values in tables
- ui to display tables and sort/filter
- backend for sorting

- ui to add and delete
- fancy dropdown for tables

## These instructions assume that you are using VScode to run this project locally
1. Install MySQL from https://dev.mysql.com/downloads/installer/
2. Run all cells in logindatabase.ipynb
3. Open a terminal using Ctrl + Shift + `. Run 
```
npm install
``` 
4. This should install all dependancies needed. Run 
```
node -v
```
to check if node is recognised If not, follow the instructions on https://hackmd.io/@hm222vx/AddNodeJSPath.

5. Lastly, run 
```
npm run dev
```
to start the server. It should be located on http://localhost:3000 and will also be displayed on the terminal. In the event that node is not recognised in the powershell terminal specifically, the following command should add it to the PATH for all subsequent powershell sessions
```
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs\", [EnvironmentVariableTarget]::User)
```
There is a test account with credentials Username: test, Email: test@testmail.com, Password: test
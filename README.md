# Project DB
### We make tracking your projects easy
Hosted on projectdb.vercel.app

## TODO list
- pages for the other 4 tables
- fancy dropdown for tables
- get some sleep.

## These instructions assume that you are using VScode to run this project locally
1. Install MySQL from https://dev.mysql.com/downloads/installer/
2. Open a terminal using Ctrl + Shift + `. Run 
3. Run the following command
```bash
npm install
```
4. This should install all dependancies needed. Run 
```bash
node -v
```
to check if node is recognised If not, follow the instructions on https://hackmd.io/@hm222vx/AddNodeJSPath.

5. If you have a copy of RailwaySetup.ipynb, ensure that the following paths match your local device
```py
...
# TODO: You might need to replace this with your own path
mysqldump_path = r"C:\Program Files\MySQL\MySQL Server 9.2\bin\mysqldump.exe"
...
```
and
```py
...
# TODO: Might need to change
mysql_executable = r"C:\Program Files\MySQL\MySQL Server 9.2\bin\mysql.exe"
...
```
before running all cells. This should update the railway database. Otherwise, change .env path to
```
DATABASE_URL=mysql+pymysql://YOURLOCALUSERNAME:YOURLOCALPASSWORD@localhost/YOURDATABASENAME
```

6. Run the following commands in succession
```bash
npx prisma db pull
npx prisma generate
npx prisma db push
```
7. Lastly, run 
```bash
npm run dev
```
to start the server. It should be located on http://localhost:3000 and will also be displayed on the terminal. In the event that node is not recognised in the powershell terminal specifically, the following command should add it to the PATH for all subsequent powershell sessions
```bash
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\nodejs\", [EnvironmentVariableTarget]::User)
```
There is a test account with credentials Username: test, Email: test@testmail.com, Password: test
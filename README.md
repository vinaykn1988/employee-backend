
NPM Modules used::

1. Gulp  
2. TypeScript
3. Express 
4. Nodemon


Steps to run::

1. First start mongo server locally.
2. Initially database will empty. Add some data by running command 'node .\loadInitialData.js'.
3. Run command 'npm test' which ignites the gulp tool
4. Finally start the server by running 'nodemon .\build\index.js', since the build file will be inside the build folder
if not exist .\node_modules\ (
  npm i
)

if not exist .\dist\ (
  npm run build
)

npm run run
pause

lsof -i :4200 -sTCP:LISTEN |awk 'NR > 1 {print $2}' | xargs kill -9
ng build pulseCLI
ng serve


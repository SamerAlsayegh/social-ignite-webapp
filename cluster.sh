screen -S gulp -X quit

screen -dmS gulp sh -c 'echo Starting gulp...; NODE_ENV=PROD gulp main;'
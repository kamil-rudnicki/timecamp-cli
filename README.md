# TimeCamp CLI

Access TimeCamp using CLI to make time tracking easier.

<img src="https://raw.githubusercontent.com/kamil-rudnicki/timecamp-cli/master/demo.gif" height="350" />

## Setup

1. `npm install`
2. `npm link`
3. Create a .js file called 'key.js' and put it in the root of the folder - in there define your timecamp API key like this:
   `var timecamp_api_key = "xxxxxxxxxxxxxxx";`
   Find your API key in your [account settings](https://www.timecamp.com/people/edit)
   
## Input flags

| Flag | Alt            | Description  |
| -----|----------------| -------------|
| -t   | --task [note]  | specify api action: start-timer, stop-timer |
| -a   | --auto     	| try to match a task for new timer based on tasks keywords and a note provided in argument |
| -k   | --key 			| your API key (optional) |
| -v   | --verbose 		| enable console logging |
| -n   | --note [note] 	| add a note |

## Usage

### Start a new timer without a task

`timecamp -t start-timer -n "Time entry note"`
Start new timer and stop automatically current timer if it was running.

### Start a new timer and try to find matching task

`timecamp -t start-timer -a -n "Time entry note with keywoard"`
Start new timer and try to find proper task if a keyword from a task is found in the note from the argument.

### Stop a timer

`timecamp -t stop-timer`
Stop current timer if it's running.

## Ideas

* `timer-status` action to get current timer and elapsed time, then use crontab to show notification of currently running timer every 15 minutes
* `add-keywoard` action to add new keyword quickly
* parameter to start a new timer with a note from a clipboard and try to find a task automatically

## Special thanks

[gravyraveydavey/timecamp-node-tasks-api](https://github.com/gravyraveydavey/timecamp-node-tasks-api)
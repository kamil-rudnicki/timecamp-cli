# TimeCamp CLI

Access TimeCamp using CLI to make time tracking easier.

## Setup

1. `npm install`
2. `npm link`
3. Create a .js file called 'key.js' and put it in the root of the folder - in there define your timecamp API key like this:
   `var timecamp_api_key = "xxxxxxxxxxxxxxx";`
   Find your API key in your [account settings](https://www.timecamp.com/people/edit)
   
## Input flags

| Flag | Alt            | Description  |
| -----|----------------| -------------|
| -s   | --start [note] | start new timer with a note |
| -h   | --stop     	| stop current timer |
| -a   | --auto     	| try to match a task for new timer based on a task keywoards and a note |
| -k   | --key 			| your API key (optional) |
| -v   | --verbose 		| enable console logging |
| -d   | --dryrun 		| dry run |

## Usage

### Start a new timer without a task

`timecamp -s "Time entry note"`
Start new timer and stop automatically current timer if it was running.

### Start a new timer and try to find matching task

`timecamp -a -s "Time entry note with keywoard"`
Start new timer and try to find proper task if a keywoard from a task is found in the note from the argument.

### Stop a timer

`timecamp -h`
Stop current timer if it's running.

## Special thanks

[gravyraveydavey/timecamp-node-tasks-api](https://github.com/gravyraveydavey/timecamp-node-tasks-api)
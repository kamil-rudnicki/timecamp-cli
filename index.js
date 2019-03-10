#!/usr/bin/env node
var request = require('request');
var fs = require('fs');
var jsonfile = require('jsonfile')
var program = require('commander');
var moment = require('moment');
var path = require('path');
var co = require('co');
var prompt = require('co-prompt');

eval(fs.readFileSync(path.dirname(fs.realpathSync(__filename)) + '/key.js')+'');

var baseUrl = "https://www.timecamp.com/third_party/api/";

//parse arguments

program
    .version('1.0.0')
    .option('-t, --task <task>', 'specify api action <start-timer|stop-timer>')
    .option('-v, --verbose', 'enable console logging')
    .option('-k, --key <key>', 'your API key')
    .option('-a, --auto', 'try to match a task for new timer based on a task keywords and a note')
    .option('-n, --note <note>', 'add a note')
    .parse(process.argv);

if(program.key !== undefined) {
    timecamp_api_key = program.key;
}

// do the requested action

switch(program.task) {
    case 'start-timer':
        console.log(`Starting a timer`);
        startTimer();
        break;
    case 'stop-timer':
        console.log(`Stopping a timer`);
        stopTimer();
        break;
    default:
        console.log('Error: please provide a task using -t [taskname]');
        break;
}

// helper functions

function getTasksApi()
{
    var options = {
        headers: {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/json'
        },
        url: baseUrl + "tasks/format/json/perms/track_time/api_token/" + timecamp_api_key,
        method: 'GET'
    };

    //console.log(options.url);
    //process.exit();

    return new Promise(function (fulfill, reject){

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                current_projects = JSON.parse(response.body);
                fulfill(current_projects);
            } else {
                console.log('error getting tasks');
                console.log('status code: ' + response.statusCode );
                console.log('status: ' + response.body);
                reject(false);
                process.exit();
            }
        });

    });
}

function startTimerApi(args)
{
    var options = {
        headers: {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/json'
        },
        url: baseUrl + "timer/format/json/api_token/" + timecamp_api_key,
        method: 'POST',
        form: args
    };
    return new Promise(function (fulfill, reject){

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                current_projects = JSON.parse(response.body);
                fulfill(current_projects);
            } else {
                console.log('error starting timer');
                console.log('status code: ' + error );
                console.log('status code: ' + response );
                console.log('status: ' + response.body);
                reject(false);
                process.exit();
            }
        });

    });
}

function startTimer()
{
    var tasks = getTasksApi();
    tasks.then(function(allTasks){

        var timer = {
            service: "timecamp-cli",
            entry_id: "create",
            started_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            action: "start"
        };

        if(program.note !== undefined) {
            timer.note = program.note;

            if(program.auto !== undefined && program.auto == 1) {
                console.log("Trying to match a task...");

                var bestTask = findTagInTasks(program.note, allTasks);
                if(bestTask.task_id == 0) {
                    console.log("No task found for: " + program.note);
                } else {
                    console.log("Found matching task: " + bestTask.task);
                    timer.task_id = bestTask.task_id;
                }
            }
        }

        var timer2 = startTimerApi(timer);
        timer2.then(function(val){
            console.log(val);
        });

    });
}

function stopTimer()
{
    var timer = {
        service: "timecamp-cli",
        started_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        action: "stop"
    };

    var timer2 = startTimerApi(timer);
    timer2.then(function(val){
        console.log(val);
    });
}

var prepareTasksToFindTag = function(allTasks)
{
    for( task2 in allTasks )
    {
        if( allTasks[task2]['tags'] != null )
        {
            allTasks[task2]['tags'] = allTasks[task2]['tags'].split(",");
            for( tag in allTasks[task2]['tags'] )
            {
                allTasks[task2]['tags'][tag] = allTasks[task2]['tags'][tag].trim().toLowerCase();
            }
        }
    }

    return allTasks;
};

var findTagInTasks = function(inputTag, allTasks)
{
    allTasks = prepareTasksToFindTag(allTasks);
    inputTag = inputTag.trim().toLowerCase();

    if( allTasks != null )
    {
        return findBestTask(inputTag, allTasks);
    }

    return {matched: 0, task: "", tag: "", task_id: 0};
};

var findBestTask = function(inputTag, allTasks)
{
    var bestTask = {matched: 0, task: "", tag: "", task_id: 0};

    Object.keys(allTasks).forEach(function(key){
        var task2 = allTasks[key];
        if (task2['tags'] != null)
        {
            var matched = 0;
            task2['tags'].forEach(function (tag)
            {
                var withoutTags = tag.replace(/^\[.[0-9]*\]/g, "");
                if (withoutTags.length == 0)
                    withoutTags = tag;

                var found = inputTag.indexOf(withoutTags);
                if (found != -1) {
                    if (tag.indexOf("[b]") == 0)
                    {
                        var matches = inputTag.match(new RegExp("\\b" + withoutTags + "\\b", 'g'));
                        if (matches != null)
                            matched += withoutTags.length;
                    }
                    else if (tag.indexOf("[*") == 0)
                    {
                        var number = tag.match(/^\[.[0-9]*\]/g)[0].replace("[*", "");
                        number = number.replace("]", "");
                        matched += parseInt(number);
                    }
                    else
                        matched += tag.length;
                }
            });

            if (bestTask.matched < matched)
            {
                bestTask.matched = matched;
                bestTask.task = task2['name'];
                bestTask['tag'] = inputTag;
                bestTask['task_id'] = task2['task_id'];
            }
        }
    });

    return bestTask;
};
define(["lib/utilities", "deps/under"], function(utilities, underscore) { 


    /* Idea: I think that maybe I should just try brute forcing it, and then see what type of results I get for small values.
       If then I can discern a pattern, perhaps I can use that to discover the recurrence.

       Actually, if I know that you can always produce an optimal solution with the jobs ordered with strictly increasing deadlines,
       then you know that the optimal schedule with the current job in it will have it last, and so you only have to compare it to the 
       schedule that would otherwise be in place.
     */
    
    var _ = underscore._;

    var examples = { first: [[1,5,6],
                             [4,9,6],
                             [3,10,8],
                             [1,7,4],
                             [1,7,5],
                             [8,10,7],
                             [8,9,11]]
                   }

    var to_jobs = function(list) {
        return _.map(list, function(j) { return { duration: j[0], deadline: j[1], profit: j[2] }; });
    }

    var Schedule = function(jobs) {
        this.jobs = jobs;
    }

    Schedule.prototype.profit = function() { 
        return _.reduce(this.jobs, function(sum, j) { return sum + j.profit; }, 0);
    }

    Schedule.prototype.start_time = function(job) { 
        var start_time = 0;
        for(var i = 0; i < this.jobs.length; i++) {
            var j = this.jobs[i];
            if(job === j) {
                return start_time;
            } else {
                start_time = start_time + j.duration;
            }                    
        }
        throw new Error("This job isn't on this schedule!");
    }

    Schedule.prototype.first_available_time = function() {
        return _.reduce(this.jobs, function(j, time_used) { return time_used + j.duration; }, 0);
    }

    Schedule.prototype.swap_job_in = function(job) { 
        var end_time = 0;
        var latest_start_time = job.deadline - job.duration - 1;
        for(var i = 0; i < this.jobs.length; i++) {
            var j = this.jobs[i];
            end_time = end_time + j.duration;
            if(end_time > latest_start_time) {
                return new Schedule(this.jobs.slice(0, i).concat([job]));
            }
        }
        return new Schedule(this.jobs.slice(0).concat([job]));
    }

    var better_schedule = function(s1, s2) {
        var profit_diff = s1.profit() - s2.profit();
        if(profit_diff > 0) { 
            // console.log("earlier wins!");
            return s1; 
        } else if(profit_diff < 0) {
            // console.log("later wins!");
            return s2;
        } else {
            return (s1.first_available_time() <= s2.first_available_time()) ? s1 : s2;
        }
    }


    var schedule_jobs = function(job_list) {
        var table = [];
        var jobs = _.sortBy(job_list, function(j) { return j.deadline; });
        console.log(jobs);
        var latest_deadline = _.last(jobs).deadline;
        for(var job_ix = 0; job_ix < jobs.length; job_ix++) {
            table[job_ix] = [];
            for(var time = 0; time <= latest_deadline; time++) {
                var job = jobs[job_ix];
                if(job_ix === 0 || time === 0) { 
                    table[job_ix][time] = 0;
                } else if(job.deadline < time) {
                    table[job_ix][time] = table[job_ix][job.deadline];
                } else if(job.deadline >= time && time >= job.duration) {
                    table[job_ix][time] = Math.max(table[job_ix - 1][time], table[job_ix - 1][time - job.duration] + job.profit);
                } else if(time < job.duration) {
                    table[job_ix][time] = table[job_ix - 1][time];
                }
                console.log("job_ix: " + job_ix + ", time: " + time + ", profit: " + table[job_ix][time]);
            }
        }
        return table;
    }

    
    return {
        examples: examples,
        to_jobs: to_jobs,
        Schedule: Schedule,
        schedule_jobs: schedule_jobs
    }

});
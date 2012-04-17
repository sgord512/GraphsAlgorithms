define(["deps/under"], function() {


    var _ = underscore._;

    var problem = {};
    var p = problem;

    problem.possible_hours = _.range(0,10);

    problem.schedules = [
        [1,3,5,7,9],
        [1,2,3,4,5],
        [0,5,8,9],
        [1,4,6],
        [0,1,2,7],
        [5,6],
    ]

    problem.ta_staff = [];
    _.each(p.schedules, function(hours, number) { p.ta_staff.push({ ta_number: "t" + number, free: hours, booked: [] }); });

    problem.min_total_hours = 5;
    problem.max_hours_per_ta = 3;

    problem.assigned_hours = {};

    problem.assign_hours = function() {
        var ta_number;
        while(hours_remaining_to_book(assigned_hours, min_total_hours) > 0) {
            if(p.possible_hours.length === 0) { throw new Error("Infeasible problem"); }
            
            if(ta_number = find_ta_with_bookable_hour(p.ta_staff, _.first(p.possible_hours))) {
                book_ta_for_hour(ta_number, p.possible_hours.shift());
            } else { 
                p.possible_hours.shift(); 
            }
        }
        console.log("Success!");
        console.log(assigned_hours);
    }

    problem.find_ta_with_bookable_hour = function(hour) {
        var found = false;
        var next_to_check = 0;
        while(!found && next_to_check < p.ta_staff.length) {
            var ta = p.ta_staff[next_to_check];
            if(_.include(ta.free, hour) && hours_remaining_for_ta(ta) > 0) {
                return ta_number;
            }
            next_to_check++;
        }
        return undefined;
    }

    problem.get_ta = function(num) {
        return _.find(p.ta_staff, function(ta) { return (ta.ta_number === num); });
    }

    problem.book_ta_for_hour = function(ta_number, hour) {
        assigned_hours[hour] = ta_number;
        var ta = get_ta(ta_number);
        ta.free: _.without(ta.free, hour);
        ta.booked: ta.booked.push(hour);
        return ta;
    }
        
    problem.hours_remaining_for_ta = function(ta) {
        return max_hours_per_ta - ta.booked.length;
    }

    problem.hours_remaining_to_book = function() { return min_total_hours - assigned_hours.length; }

});
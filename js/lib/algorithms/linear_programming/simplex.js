define(['deps/under', "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;

    var example = new LinearProgram('slack', { 'N': [0,1,2],
                                               'B': [3,4,5],
                                               'A': [undefined,
                                                     undefined,
                                                     undefined,
                                                     [undefined,1,1,-3],
                                                     [undefined,2,2,5],
                                                     [undefined,4,1,2]],
                                               'b': [undefined,
                                                     undefined,
                                                     undefined,
                                                     30,
                                                     24,
                                                     36],
                                               'c': [3,1,2,undefined,undefined,undefined],
                                               'v': 0 });
                                   
    



});
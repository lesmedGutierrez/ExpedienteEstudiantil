/**
 * Created by lesme on 14/10/2015.
 */
'use strict';

angular.module('estudiantes').service('yearPicker', [

    function() {
        //Generates a list of years from a static start Year to the Current Year.
        this.generateListOfYears = function() {
            var startYear = 1950;
            var currentYear = new Date().getFullYear(), years = [];
            while ( startYear <= currentYear ) {
                years.push({year: startYear});
                startYear++;
            }
            return years;
        };
    }
]);

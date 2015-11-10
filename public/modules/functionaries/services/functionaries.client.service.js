'use strict';

//Functionaries service used to communicate Functionaries REST endpoints
angular.module('functionaries').factory('Functionaries', ['$resource',
	function($resource) {
		return $resource('functionaries/:functionaryId', { functionaryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('functionaries').factory('GetFunctionaryExperiences', ['$resource',
	function($resource){
		return $resource('/functionary-resume-experiences/:functionary', { functionary: '@functionary'
		}, {
			update: {
				method: 'GET'
			}
		});
	}
]);

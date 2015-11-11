'use strict';

// Functionary resume educations controller
angular.module('functionary-resume-educations').controller('FunctionaryResumeEducationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Functionaries', 'FunctionaryResumeEducations','Utility',
	function($scope, $stateParams, $location, Authentication, Functionaries, FunctionaryResumeEducations, Utility) {
		$scope.authentication = Authentication;

		// Create new Functionary resume education
		$scope.create = function() {
			// Create new Functionary resume education object
			var functionaryResumeEducation = new FunctionaryResumeEducations ({
				functionary: this.functionary._id,
				schoolName: this.schoolName,
				description: this.description,
				degree: this.degree,
				attendedStartDate: this.attendedStartDate.year,
				attendedEndDate: this.attendedEndDate.year
			});
			console.log('Hi');

			// Redirect after save
			functionaryResumeEducation.$save(function(response) {
				//$location.path('functionaries/' + this.functionary._id);
				//$location.path('functionary-resume-educations/' + response._id);
				//Clear fields

				$scope.schoolName = '';
				$scope.description = '';
				$scope.degree = '';
				$scope.attendedStartDate = '';
				$scope.attendedEndDate = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		// Remove existing Functionary resume education
		$scope.remove = function(functionaryResumeEducation) {
			if ( functionaryResumeEducation ) { 
				functionaryResumeEducation.$remove();

				for (var i in $scope.functionaryResumeEducations) {
					if ($scope.functionaryResumeEducations [i] === functionaryResumeEducation) {
						$scope.functionaryResumeEducations.splice(i, 1);
					}
				}
			} else {
				$scope.functionaryResumeEducation.$remove(function() {
					$location.path('functionary-resume-educations');
				});
			}
		};

		// Update existing Functionary resume education
		$scope.update = function() {
			var functionaryResumeEducation = $scope.functionaryResumeEducation;

			functionaryResumeEducation.$update(function() {
				$location.path('functionary-resume-educations/' + functionaryResumeEducation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionary resume educations
		$scope.find = function() {
			$scope.functionaryResumeEducations = FunctionaryResumeEducations.query();
		};

		// Find existing Functionary resume education
		$scope.findOne = function() {
			$scope.functionaryResumeEducation = FunctionaryResumeEducations.get({ 
				functionaryResumeEducationId: $stateParams.functionaryResumeEducationId
			});
		};

		$scope.optionsYearRange = Utility.generateListOfYears();

		$scope.attendedStartDate = $scope.optionsYearRange[$scope.optionsYearRange.length-2];
		$scope.attendedEndDate = $scope.optionsYearRange[$scope.optionsYearRange.length-1];
	}
]);

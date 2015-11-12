'use strict';

// Functionary resume experiences controller
angular.module('functionary-resume-experiences').controller('FunctionaryResumeExperiencesController', ['$scope', '$stateParams', '$location', 'Authentication', 'FunctionaryResumeExperiences', 'Utility',
	function($scope, $stateParams, $location, Authentication, FunctionaryResumeExperiences, Utility) {
		$scope.authentication = Authentication;

		$scope.functionaryExperiences = [];

		// Create new Functionary resume experience
		$scope.create = function() {
			// Create new Functionary resume experience object
			var functionaryResumeExperience = new FunctionaryResumeExperiences ({
				functionary: this.functionary._id,
				companyName: this.companyName,
				functionaryTitle: this.functionaryTitle,
				companyLocation: this.companyLocation,
				description: this.description,
				attendedStartDate: this.attendedStartDate.year,
				attendedEndDate: this.attendedEndDate.year
			});
			// Redirect after save
			functionaryResumeExperience.$save(function(response) {
				$scope.companyName = '';
				$scope.functionaryTitle = '';
				$scope.companyLocation = '';
				$scope.description = '';
				$scope.functionaryExperiences.push(response);
				$scope.modalParent.dismiss();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Functionary resume experience
		$scope.remove = function(functionaryResumeExperience) {
			if ( functionaryResumeExperience ) { 
				functionaryResumeExperience.$remove();
				for (var i in $scope.functionaryResumeExperiences) {
					if ($scope.functionaryResumeExperiences [i] === functionaryResumeExperience) {
						$scope.functionaryResumeExperiences.splice(i, 1);
					}
				}

				for (var i in $scope.functionaryExperiences){
					if ($scope.functionaryExperiences [i] === functionaryResumeExperience){
						$scope.functionaryExperiences.splice(i, 1);
					}
				}
			} else {
				$scope.functionaryResumeExperience.$remove(function() {
					$location.path('functionary-resume-experiences');
				});
			}
		};

		// Update existing Functionary resume experience
		$scope.update = function() {
			var experience = $scope.experience;
			console.log($scope.experience);
			experience.$update(function() {
				$location.path('functionary-resume-experiences/' + experience._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionary resume experiences
		$scope.find = function() {
			$scope.functionaryResumeExperiences = FunctionaryResumeExperiences.query();
		};
		$scope.findByFunctionary = function (functionary) {
			$scope.find();
			console.log('Calling this :D');
			$scope.selectedFunctionary = functionary;
			var result = [];
			functionary.$promise.then(function (func) {
				$scope.functionaryResumeExperiences.$promise.then(function(functionaryResumeExperiences){
					functionaryResumeExperiences.forEach(function(experience) {
						if (experience.functionary === func._id) {
							result.push(experience);
						}
					});
					$scope.functionaryExperiences = result;
					console.log(result);
				});
			});
		};

		// Find existing Functionary resume experience
		$scope.findOne = function() {
			$scope.functionaryResumeExperience = FunctionaryResumeExperiences.get({ 
				functionaryResumeExperienceId: $stateParams.functionaryResumeExperienceId
			});
		};

		$scope.cancel = function () {
			$scope.modalParent.dismiss();
		};

		$scope.$watch('experience', function() {
			if ($scope.experience !== undefined){
				$scope.loadExperienceInfo();
			}
		});

		$scope.loadExperienceInfo = function (){
			$scope.companyName = $scope.experience.companyName;
			$scope.functionaryTitle = $scope.experience.functionaryTitle;
			$scope.companyLocation = $scope.experience.companyLocation;
			$scope.description = $scope.experience.description;
			$scope.optionsYearRange.forEach(function (year) {
				if ($scope.experience.attendedStartDate === year.year){
					$scope.attendedStartDate = year;
				}
				if ($scope.experience.attendedEndDate === year.year){
					$scope.attendedEndDate = year;
				}
			});
		};

		$scope.optionsYearRange = Utility.generateListOfYears();

		$scope.attendedStartDate = $scope.optionsYearRange[$scope.optionsYearRange.length-2];
		$scope.attendedEndDate = $scope.optionsYearRange[$scope.optionsYearRange.length-1];

	}
]);

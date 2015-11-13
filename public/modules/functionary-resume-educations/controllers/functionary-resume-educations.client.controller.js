'use strict';

// Functionary resume educations controller
angular.module('functionary-resume-educations').controller('FunctionaryResumeEducationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FunctionaryResumeEducations','Utility', '$modal',
	function($scope, $stateParams, $location, Authentication, FunctionaryResumeEducations, Utility, $modal) {
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

			// Redirect after save
			functionaryResumeEducation.$save(function(response) {
				//Clear fields
				$scope.schoolName = '';
				$scope.description = '';
				$scope.degree = '';
				$scope.attendedStartDate = '';
				$scope.attendedEndDate = '';
				$scope.functionaryEducations.push(functionaryResumeEducation);
				$scope.modalParent.dismiss();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.modalAddEducation = function (size, selectedFunctionary, functionaryEducations) {
			var modalInstance = $modal.open({
				backgroundColor: 'white',
				animation: $scope.animationsEnabled,
				templateUrl: 'modules/functionary-resume-educations/views/create-functionary-resume-education.client.view.html',
				size: size,
				controller: function($scope, $modalInstance, functionary){
					$scope.functionary = functionary;
					$scope.modalParent = $modalInstance;
					$scope.functionaryEducations = functionaryEducations;
				},

				resolve: {
					functionary: function () {
						return selectedFunctionary;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
			});
		};

		$scope.modalUpdateEducation = function	(size, selectedEducation ,functionaryEducations){
			var updateModalInstance = $modal.open({
				backgroundColor: 'white',
				animation: $scope.animationsEnabled,
				templateUrl: '/modules/functionary-resume-educations/views/edit-functionary-resume-education.client.view.html',
				size: size,
				controller: function($scope, $modalInstance, education){
					$scope.education = education;
					$scope.modalParent = $modalInstance;
					$scope.functionaryEducations = functionaryEducations;
				},
				resolve: {
					education: function () {
						return selectedEducation;
					}
				}
			});

			updateModalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
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
				for (var i in $scope.functionaryEducations){
					if ($scope.functionaryEducations [i] === functionaryResumeEducation) {
						$scope.functionaryEducations.splice(i, 1);
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
			$scope.education.schoolName = $scope.schoolName;
			$scope.education.description = $scope.description;
			$scope.education.degree = $scope.degree;
			$scope.education.attendedStartDate = $scope.attendedStartDate.year;
			$scope.education.attendedEndDate = $scope.attendedEndDate.year;
			var education = $scope.education;
			education.$update(function() {
                $scope.modalParent.dismiss();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Functionary resume educations
		$scope.find = function() {
			$scope.functionaryResumeEducations = FunctionaryResumeEducations.query();
		};

		$scope.findByFunctionary = function (functionary) {
			$scope.find();
			$scope.selectedFunctionary = functionary;
			var result = [];
			functionary.$promise.then(function (func) {
				$scope.functionaryResumeEducations.$promise.then(function(functionaryResumeEducations){
					functionaryResumeEducations.forEach(function(education) {
						if (education.functionary === func._id) {
							result.push(education);
						}
					});
					$scope.functionaryEducations = result;
				});
			});
		};

		// Find existing Functionary resume education
		$scope.findOne = function() {
			$scope.functionaryResumeEducation = FunctionaryResumeEducations.get({ 
				functionaryResumeEducationId: $stateParams.functionaryResumeEducationId
			});
		};

		$scope.$watch('education', function() {
			if ($scope.education !== undefined){
				$scope.loadEducationInfo();
			}
		});

		$scope.loadEducationInfo = function (){
			$scope.schoolName = $scope.education.schoolName;
			$scope.description = $scope.education.description;
			$scope.degree = $scope.education.degree;

			$scope.optionsYearRange.forEach(function (year) {
				if ($scope.education.attendedStartDate === year.year){
					$scope.attendedStartDate = year;
				}
				if ($scope.education.attendedEndDate === year.year){
					$scope.attendedEndDate = year;
				}
			});
		};

		$scope.cancel = function () {
			$scope.modalParent.dismiss();
		};

		$scope.optionsYearRange = Utility.generateListOfYears();
		$scope.attendedStartDate = $scope.optionsYearRange[$scope.optionsYearRange.length-2];
		$scope.attendedEndDate = $scope.optionsYearRange[$scope.optionsYearRange.length-1];
	}
]);

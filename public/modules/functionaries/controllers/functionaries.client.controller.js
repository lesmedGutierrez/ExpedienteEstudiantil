'use strict';

// Functionaries controller


angular.module('functionaries').controller('FunctionariesController', ['$scope', '$stateParams', '$location', '$controller', 'Authentication', 'Functionaries', 'Utility',
	function($scope, $stateParams, $location, Authentication, $controller, Functionaries, Utility) {
		$scope.authentication = Authentication;

		$scope.animationsEnabled = true;
		$scope.experience = [];
		$scope.education = [];

		//Open a modal window to Add a single education to the resume.
		$scope.toggleAnimation = function () {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};


		// Create new Experience
		$scope.create = function() {
			// Create new Functionary object
			var functionary = new Functionaries ({
				firstName: this.firstName,
				firstSurname: this.firstSurname,
				secondSurname: this.secondSurname,
				identification: this.identification,
				birthdate: this.birthdate,
				maritalStatus: this.maritalStatus.maritalStatus,
				role: this.role.role,
				address: this.address,
				phoneNumber: this.phoneNumber,
				cellphoneNumber: this.cellphoneNumber,
				email: this.email,
				hireDate: this.hireDate,
				status: this.status.status
			});

			// Redirect after save
			functionary.$save(function(response) {
				$location.path('functionaries/' + response._id);
				// Clear form fields
				$scope.firstName  = '';
				$scope.firstSurname = '';
				$scope.secondSurname = '';
				$scope.identification = '';
				$scope.birthdate = '';
				$scope.maritalStatus = '';
				$scope.role = '';
				$scope.phoneNumber = '';
				$scope.cellphoneNumber = '';
				$scope.email = '';
				$scope.hireDate = '';
				$scope.status = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.optionsMaritalStatus = Utility.getMaritalStatusList();
		$scope.optionsFunctionaryRoles = Utility.getFunctionaryRoles();
		$scope.optionsFunctionaryStatus = Utility.getFunctionaryStatus();
		$scope.maritalStatus = $scope.optionsMaritalStatus[0];
		$scope.role = $scope.optionsFunctionaryRoles[0];
		$scope.status = $scope.optionsFunctionaryStatus[0];

		// Remove existing Functionary
		$scope.remove = function(event,functionary) {
			if ( functionary ) {
				event.preventDefault();
				event.stopPropagation();
				functionary.$remove();
				for (var i in $scope.functionaries) {
					if ($scope.functionaries [i] === functionary) {
						$scope.functionaries.splice(i, 1);
					}
				}
			} else {
				$scope.functionary.$remove(function(){});
			}
		};

		// Update existing Functionary
		$scope.update = function() {
			var functionary = $scope.functionary;
			functionary.maritalStatus = $scope.maritalStatus.maritalStatus;
			functionary.status = $scope.status.status;
			functionary.role = $scope.role.role;
			functionary.$update(function() {
				$location.path('functionaries/' + functionary._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		$scope.setComboValues = function () {
			$scope.functionary.$promise.then(function(functionary){
				$scope.optionsFunctionaryStatus.forEach(function(status){
					if(functionary.status === status.status){
						$scope.status = status;
					}
				});
				$scope.optionsFunctionaryRoles.forEach(function(role){
					if(functionary.role === role.role){
						$scope.role = role;
					}
				});
				$scope.optionsMaritalStatus.forEach(function(maritalStatus){
					if(functionary.maritalStatus === maritalStatus.maritalStatus){
						$scope.maritalStatus = maritalStatus;
					}
				});
			});
		};

		// Find a list of Functionaries
		$scope.find = function() {
			$scope.functionaries = Functionaries.query();
		};

		// Find existing Functionary
		$scope.findOne = function() {
			$scope.functionary = Functionaries.get({ 
				functionaryId: $stateParams.functionaryId
			});
			$scope.setComboValues();
		};
	}
]);

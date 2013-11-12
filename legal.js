angular.module('10digit.legal', ['ngResource', '10digit.utils'])

.factory('LegalConfig', function(){
    var config = {
        testMode: false,
        initialValues: {
            legal: true
        }
    }
    return config;
})

.controller('LegalCtrl',['$scope', '$resource', 'ModalInstanceService', 'LegalConfig', function($scope, $resource, Modal, Config){
	if(Config.testMode){
		$scope.legal = Config.initialValues.legal;
	}
	if(!$scope['legal_s']) $scope['legal_s'] = {};
	$scope.agreements = {tos: '', loa: '', privacy: ''};
	var Resource = $resource('/api/legal');
	var resource = Resource.get({}, function(){
		$scope.agreements = resource;
	});

	$scope.agreement = function(title, content){
		var modal = Modal.open({
			scope: $scope,
			resolve: {
				title: function(){ return title; },
				content: function(){ return $scope.agreements[content]; },
				okText: function(){ return 'ACCEPT';}
			}
		});

		modal.result.then(function(){
			var key = function(){ return content + '_signed';}
			$scope['legal_s'][key()] = true;
		});

		return false;
	}
}])

.directive('legalAgreement', function () {
	return {
		restrict:'E',
		controller:'LegalCtrl',
		replace: false,
		templateUrl: 'template/10digit/legal.html'
	};
});


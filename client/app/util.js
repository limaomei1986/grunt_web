var DEVELOP_MODE = '@@DEVELOP_MODE';

var Util = (function() {
	var BASE_URL = location.protocol + '//' + location.hostname +
		(location.port == '' ? '' : (':' + location.port)) + '/' + '@@CONTEXT_PATH';

	return {
		api: function(requestPath) {
			var pathParts = requestPath.split('?');
			pathParts[0] = pathParts[0] + (DEVELOP_MODE == 'true' ? '.json' : '');
			return BASE_URL + '@@API_NAME/' + pathParts.join('?');
		}
	}
})();
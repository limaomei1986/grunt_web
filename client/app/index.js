Ajax.get(Util.api('query/json/language/list')).done(function(response) {
	console.log(response.data);
}).fail(function() {
	console.log('请求失败');
});
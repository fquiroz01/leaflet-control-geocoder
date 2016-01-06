var L = require('leaflet'),
	Util = require('../util');

module.exports = {
	class: L.Class.extend({
		options: {
			service_url: 'https://geocoder.cit.api.here.com/6.2/geocode.json',
	        service_url_reverse: 'https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json'
		},

		initialize: function(appId, appCode, options) {
			this._appId = appId;
	        this._code = appCode;
			L.setOptions(this, options);
			// Backwards compatibility
			this.options.serviceUrl = this.options.service_url || this.options.serviceUrl;
			this.options.serviceUrlReverse = this.options.service_url_reverse || this.options.serviceUrlReverse;
		},

		geocode: function(query, cb, context) {
			var params = {
	            searchtext: query,
	            gen: 8
	        };
	        if (this._appId)
	            params['app_id'] = this._appId;
	        if (this._code)
	            params['app_code'] = this._code;

	        L.Control.Geocoder.getJSON(this.options.serviceUrl, params, function (data) {
	            var results = [],
                        loc,
                        latLng,
                        latLngBounds;
	            if (data.Response) {
	                loc = data.Response;
	                latLng = L.latLng(loc.View[0].Result[0].Location.DisplayPosition.Latitude, loc.View[0].Result[0].Location.DisplayPosition.Longitude);
	                latLngBounds = L.latLngBounds(
                                    L.latLng(loc.View[0].Result[0].Location.MapView.TopLeft.Latitude, loc.View[0].Result[0].Location.MapView.TopLeft.Longitude),
                                    L.latLng(loc.View[0].Result[0].Location.MapView.BottomRight.Latitude, loc.View[0].Result[0].Location.MapView.BottomRight.Longitude));
	                results[0] = {
	                    name: loc.View[0].Result[0].Location.Address.Label,
	                    bbox: latLngBounds,
	                    center: latLng
	                };
	            }

	            cb.call(context, results);
	        });
		},

		reverse: function(location, scale, cb, context) {
			var params = {
	            prox: encodeURIComponent(location.lat) + ',' + encodeURIComponent(location.lng),
	            mode: 'retrieveAddresses',
	            maxresults: 1,
	            gen: 8
	        };
	        if (this._appId)
	            params['app_id'] = this._appId;
	        if (this._code)
	            params['app_code'] = this._code;

	        L.Control.Geocoder.getJSON(this.options.serviceUrlReverse, params, function (data) {
	            var results = [],
						loc,
						latLng,
						latLngBounds;
	            if (data.Response) {
	                loc = data.Response;
	                latLng = L.latLng(loc.View[0].Result[0].Location.DisplayPosition.Latitude, loc.View[0].Result[0].Location.DisplayPosition.Longitude);
	                latLngBounds = L.latLngBounds(
                                    L.latLng(loc.View[0].Result[0].Location.MapView.TopLeft.Latitude, loc.View[0].Result[0].Location.MapView.TopLeft.Longitude),
                                    L.latLng(loc.View[0].Result[0].Location.MapView.BottomRight.Latitude, loc.View[0].Result[0].Location.MapView.BottomRight.Longitude));
	                results[0] = {
	                    name: loc.View[0].Result[0].Location.Address.Label,
	                    bbox: latLngBounds,
	                    center: latLng
	                };
	            }

	            cb.call(context, results);
	        });
	    }
	}),

	factory: function(appId, appCode, options) {
		return new L.Control.Geocoder.Here(appId, appCode, options);
	}
};

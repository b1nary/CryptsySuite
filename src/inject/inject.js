var settings;
chrome.storage.local.get("gs_settings", function(items) {

	if(items["gs_settings"] == null){
		var settings = {
			"sidebar": {
				"hidden": {
					"USD": true,
					"BTC": false,
					"LTC": false,
					"XPM": false,
					"Account": true,
					"Cryptsy": true
				},
				"toggle": {
					"USD": false,
					"BTC": false,
					"LTC": false,
					"XPM": false,
					"Account": false,
					"Cryptsy": false
				}
			},
			"watcher_enabled": true,
			"watcher_speed": 5000,
			"watchlist": {},
			"ajaxify": false
		}
	}

	chrome.storage.local.set({
		'gs_settings': JSON.stringify(settings)
	});

    var settings = JSON.parse(items["gs_settings"]);
    var markets = {}
    var balance = {}

	console.log("Cryptsy.com Suite loaded...");

	function save_setting(){
		chrome.storage.local.set({
			'gs_settings': JSON.stringify(settings)
		});
	}

	function index_markets(){
		markets = {}
		$(".moduletable-btc-markets .nav-list li a").each(function(){
			if( $(this).attr('id') != null ){
				var _id = $(this).attr('id').toString().split("_")[1]
				var val = $.trim($(this).text().replace(/  /g, " ")).split(" ")
				markets[val[0]] = { 'price': val[1], 'id': _id }
			}
		});
		$(".moduletable-ltc-markets .nav-list li a").each(function(){
			if( $(this).attr('id') != null ){
				var _id = $(this).attr('id').toString().split("_")[1]
				var val = $.trim($(this).text().replace(/  /g, " ")).split(" ")
				markets[val[0]] = { 'price': val[1], 'id': _id }
			}
		});
		$(".moduletable-xpm-markets .nav-list li a").each(function(){
			if( $(this).attr('id') != null ){
				var _id = $(this).attr('id').toString().split("_")[1]
				var val = $.trim($(this).text().replace(/  /g, " ")).split(" ")
				markets[val[0]] = { 'price': val[1], 'id': _id }
			}
		});
	}

	function index_balance(){
		$(".moduletable-account-balances .nav-list li a").each(function(){
			if( $(this).attr('id') != null ){
				var _id = $(this).attr('id').toString().split("_")[1]
				var val = $.trim($(this).text().replace(/  /g, " ")).split(" ")
				balance[val[0]] = { 'count': val[1], 'id': _id }
			}
		});
	}

	function reindex_recent_trades(){
		$("#tradehistory tr").each(function(){
			var val = $("td", this).first().text().replace(/\s/g, " ").replace(/  /g," ").replace(/    /g," ").split(" ")
			var market = val[3]
			if(markets[market] != null){
				$("td", this).first().html( $("td", this).first().html().replace(market, "<a data-tooltip='"+markets[market]["price"]+"' href='/markets/view/"+markets[market]["id"]+"'>"+market+"</a>") )
				$(this).attr('data-recenttype', val[2]);
			}
		});

		$(".panel-market-list .panel-heading").css('position','relative')
			.append('<div style="position:absolute; right:10px; top:-0px"><select id="filter_recent">'+
				'<option value="all">all</option>'+
				'<option value="Buy">buy</option>'+
				'<option value="Sell">sell</option>'+
				'</select></div>')
		$("#filter_recent").on('change', function(){
			var val = $(this).val()
			$("[data-recenttype]").show();
			if(val == "Buy"){ $("[data-recenttype='Sell']").hide() }
			else if(val == "Sell"){ $("[data-recenttype='Buy']").hide() }
		});
	}

	function reindex_open_trades(){
		$("#openorders tr").each(function(){
			var val = $("td", this).first().text().replace(/\s/g, " ").replace(/  /g," ").replace(/    /g," ").split(" ")
			var market = val[3]
			if(markets[market] != null){
				$("td", this).first().html( $("td", this).first().html().replace(market, "<a data-tooltip='"+markets[market]["price"]+"' href='/markets/view/"+markets[market]["id"]+"'>"+market+"</a>") )
				$(this).attr('data-recenttype', val[2]);

				console.log(val)
			}
		});

		$(".panel-market-list .panel-heading").css('position','relative')
			.append('<div style="position:absolute; right:10px; top:-0px"><select id="filter_recent">'+
				'<option value="all">all</option>'+
				'<option value="Buy">buy</option>'+
				'<option value="Sell">sell</option>'+
				'</select></div>')
		$("#filter_recent").on('change', function(){
			var val = $(this).val()
			$("[data-recenttype]").show();
			if(val == "Buy"){ $("[data-recenttype='Sell']").hide() }
			else if(val == "Sell"){ $("[data-recenttype='Buy']").hide() }
		});
	}

	$(document).ready(function(){

		/*
		* 	Current stack
		*/
		$("#sidebar .alert-black").css('cursor','pointer');
		$("#sidebar .alert-black").on('click', function(){
			$("b", this).load("https://www.cryptsy.com/users/balances .panel-account-balances center span b")
		});

		/*
		*	Sidebar Toggles
		*/
		$("#sidebar .moduletable").each(function(){ // &#x25BC; down
			$(".moduletable-header", this).prepend('<span data-toggle="open" class="toggle_sidebar">&#x25BC;</span>')
		});
		// hide already hidden / close already closed
		var _tog = settings["sidebar"]["toggle"]
		var _hid = settings["sidebar"]["hidden"]
		$("#sidebar .moduletable").each(function(){
			var _title = $(".moduletable-header", this).text().split(" ")[1]
			if(_tog[_title] == true){
				$(this).find('span.toggle_sidebar').html("&#x25B2;")
				$(this).find('span.toggle_sidebar').attr('data-toggle','closed')
				$(this).find('span.toggle_sidebar').attr('data-height',$(this).outerHeight())
				$(this).css('overflow','hidden').stop().animate({ height: '16px' },400);
			}
			if(_hid[_title] == true){
				$(this).hide()
				$(this).find('span.toggle_sidebar').attr('data-hidden','true')
			}
		});
		_tog =null;	_hid =null;

		// listener
		$(".toggle_sidebar").on('click', function(){ // &#x25B2; up
			if( $(this).attr('data-toggle') == "open" ){
				$(this).html("&#x25B2;")
				$(this).attr('data-toggle','closed')
				$(this).attr('data-height',$(this).parent().parent().outerHeight())
				$(this).parent().parent().css('overflow','hidden').stop().animate({ height: '16px' },400);
				var _title = $(this).parent().text().split(" ")[1]
				settings["sidebar"]["toggle"][_title] = true;
			} else {
				$(this).html("&#x25BC;")
				$(this).attr('data-toggle','open')
				$(this).parent().parent().css('overflow','hidden').stop().animate({ height: $(this).attr('data-height')+"px" },400);
				var _title = $(this).parent().text().split(" ")[1]
				settings["sidebar"]["toggle"][_title] = false;
			}
			save_setting();
		});

		/*
		*	Hide Markets
		*/
		$("#sidebar").append('<a href="#" id="hide_markets" data-toggle="off">Enable hide mode</a>');
		function hide_market_listen(){
			$(".toggle_sidebar_hidden").on('change',function(){
				var _title = $(this).parent().text().split(" ")[1]
				console.log(_title+" "+$(this).is(":checked"))
				if($(this).is(":checked")){
					$(this).parent().find('span.toggle_sidebar').attr('data-hidden','true')
					settings["sidebar"]["hidden"][_title] = true;
				} else {
					$(this).parent().find('span.toggle_sidebar').attr('data-hidden','false')
					settings["sidebar"]["hidden"][_title] = false;
				}
				save_setting();
			});
		}
		function hide_market_unlisten(){
			$(".toggle_sidebar_hidden").off('change');
		}
		$("#hide_markets").on('click',function(){
			if($(this).attr('data-toggle') == 'off'){

				$("#sidebar .moduletable").each(function(){
					if(!$(this).is(":visible")){
						$(this).show();
					}
					if($(this).find('span.toggle_sidebar').attr('data-toggle') == 'closed'){
						$(this).find('span.toggle_sidebar').attr('data-wasclosed','true')
					}
					$(this).find('span.toggle_sidebar').html("&#x25B2;")
					$(this).find('span.toggle_sidebar').attr('data-toggle','closed')
					$(this).find('span.toggle_sidebar').attr('data-height',$(this).outerHeight())
					$(this).css('overflow','hidden').stop().animate({ height: '20px' },400);

					if($(this).find('span.toggle_sidebar').attr('data-hidden') == 'true'){
						$(".moduletable-header", this).append('<input type="checkbox" class="toggle_sidebar_hidden" checked="checked">')
					} else {
						$(".moduletable-header", this).append('<input type="checkbox" class="toggle_sidebar_hidden">')
					}
				});

				$(this).attr('data-toggle','on')
				$(this).text("Disable hide mode")
				hide_market_listen();

			} else {

				$("#sidebar .moduletable").each(function(){
					if($(this).find('span.toggle_sidebar').attr('data-hidden') == 'true'){
						$(this).hide();
					}

					if($(this).find('span.toggle_sidebar').attr('data-wasclosed') != 'true'){
						$(this).find('span.toggle_sidebar').html("&#x25BC;")
						$(this).find('span.toggle_sidebar').attr('data-toggle','open')
						$(this).css('overflow','hidden').stop().animate({ height: $(this).find('span.toggle_sidebar').attr('data-height')+"px" },400);
					}

					$(".moduletable-header input[type='checkbox']", this).remove();
				});

				$(this).attr('data-toggle','off')
				$(this).text("Enable hide mode")
				hide_market_unlisten();

			}
		});


		/*
		*	Ajaxify (note done)
		*/

		if(settings["ajaxify"] == true){
			$(".navbar .nav a").on('click', function(e){
				var that = this;
				$(".working-contents").load($(this).attr('href')+" .working-contents", function(){
					$(".navbar .nav li.active").removeClass('active');
					$(that).parent().addClass('active');
				});
				e.preventDefault();
				return false;
			})
		}

		/*
		*	page specific methods
		*/

		if(window.location.toString().indexOf('/users/tradehistory') > 0){
			index_markets();
			index_balance();
			var wait_for_content = window.setInterval(function(){
				if($(".dataTables_empty").length == 0){
					reindex_recent_trades();
					window.clearInterval(wait_for_content)
				}
			}, 300);
		}

		else if(window.location.toString().indexOf('/users/balances') > 0){
			window.setTimeout(function(){
				$(".panel-account-balances table tr").each(function(){
					if(	$("td:nth-child(3)", this).text() != "0.00000000" ||
						$("td:nth-child(4)", this).text() != "0.00000000" ||
						$("td:nth-child(5)", this).text() != "0.00000000"){
							$(this).attr('data-owned', 'true')
						} else {
							$(this).attr('data-owned', 'false')
						}
				});
			
				$(".panel-account-balances .panel-heading").css('position','relative')
				.append('<div style="position:absolute; right:10px; display:none; top:-0px"><select id="filter_markets">'+
					'<option value="all">all</option>'+
					'<option value="owned">owned</option>'+
					'</select></div>')

				if(settings["markets_show_owned"]){
					$("[data-owned='false']").hide();
					$("#filter_markets option[value='owned']").attr('selected', 'selected');
				}

				$("#filter_markets").parent().delay(200).fadeIn('normal')
				$("#filter_markets").on('change',function(){
					$("[data-owned]").show();
					if($(this).val() == 'owned'){
						$("[data-owned='false']").hide();
						settings["markets_show_owned"] = true;
						save_setting();
					} else {
						settings["markets_show_owned"] = false;
						save_setting();
					}
				});

			},500);
		}

		else if(window.location.toString().indexOf('/users/dashboard') > 0){

			/*
			*	Init watch list
			*/
			if(settings["watcher_enabled"]){
				console.log('.container')

				console.log("Loading watcher...")
				window.setInterval(function(){
					index_markets()
					for (market in settings["watchlist"]){
						var _title = market
						var _watch = settings["watchlist"][market]
						var _price = parseFloat(markets[_title]["price"])
						for(var i = 0; i < _watch.length; i++){
							if(_watch[i]["action"] == "gt" && parseFloat(_watch[i]["value"]) < _price){

							} else if(_watch[i]["action"] == "lt" && parseFloat(_watch[i]["value"]) > _price){

							}
						}
					}
				}, settings["watcher_speed"]);
			}

		}

		else if(window.location.toString().indexOf('/users/orders') > 0){

			/* Reloads list all second ... cant do this right now.
			index_markets();
			index_balance();
			var wait_for_content = window.setInterval(function(){
				if($(".dataTables_empty").length == 0){
					reindex_open_trades();
					window.clearInterval(wait_for_content)
				}
			}, 300);
			*/
		}

		else if(window.location.toString().indexOf('/markets/view/') > 0){

			// Manage Watch list
			function re_watcher_listener(_market){
				$("a.remove_watcher").off('click')
				$("a.remove_watcher").on('click', function(){
					var _val = $(this).attr('data-val')
					var _act = $(this).attr('data-act')
					if(settings["watchlist"][_market] != null){
						for(var i = 0; i < settings["watchlist"][_market].length; i++){
							if(settings["watchlist"][_market][i]['value'].toString() == _val && settings["watchlist"][_market][i]['action'].toString() == _act){
								settings["watchlist"][_market].splice(i, 1)
								save_setting()
							}
						}

						$(this).parent().parent().remove();
					}
				})
			}

			$(".panel-trade-list").first().after( $('.panel-trade-list').first().clone() )

			$(".panel-trade-list").first().removeClass('panel-trade-list').addClass('panel-watch-list')
			$(".panel-watch-list").find('.panel-heading').html('<span class="glyphicon glyphicon-account-balances"></span>&nbsp;Watchlist')
			$(".panel-watch-list").find('table').remove()
			$(".panel-watch-list .dataTables_scrollBody").css('height','auto').append('<table cellpadding="0" cellspacing="0" border="0" class="table table2 table-striped dataTable" id="watchlist" style="margin-left: 0px; width: 100%; font-size:0.9em;"></table>')
			$(".panel-watch-list .dataTables_scrollBody table").append('<thead><tr><th role="columnheader" class="sorting_disabled">Action</th><th class="sorting_disabled" role="columnheader">Value</th><th></th></tr></thead><tbody>'+
				'<tr><td><select id="add_watcher_action"><option value="none">Just watch</option><option value="lt">Less than</option><option value="gt">Grater than</option></select></td><td><input id="add_watcher_value" type="text"></td><td><input type="button" id="add_watcher_submit" value="Add watcher" /></td></tr></tbody>')

			var market = $.trim($(".panel-default").first().find('.panel-heading').text()).split(" ")[1].split("Graph")[0]

			if (settings["watchlist"][market] != null){
				var _set = settings["watchlist"][market]
				for(var i = 0; i < _set.length; i++){
					var _val = _set[i]['value'];
					var _act = _set[i]['action'];
					if(_act == "gt"){ _act = "Greater than"; }
					if(_act == "lt"){ _act = "Less than"; }
					if(_act == "none"){ _act = "Just watch"; }
					$(".panel-watch-list .dataTables_scrollBody table tbody")
					.prepend('<tr><td>'+_act+'</td><td>'+_val+'</td><td><a class="remove_watcher" data-act="'+_set[i]['action']+'" data-val="'+_set[i]['value']+'" href="#remove_watcher">X</a></td></tr>')
				}
				re_watcher_listener(market);
			}

			$("#add_watcher_submit").on('click', function(){
				var _action = $("#add_watcher_action").val()
				var _value = $("#add_watcher_value").val()

				if(settings["watchlist"][market] == null)
					settings["watchlist"][market] = []

				settings["watchlist"][market].push({ 'action': _action, 'value': _value, 'fired': false })
				$(".panel-watch-list .dataTables_scrollBody table tbody")
					.prepend('<tr><td>'+_action+'</td><td>'+_value+'</td><td><a class="remove_watcher" data-act="'+_action+'" data-val="'+_value+'" href="#remove_watcher">X</a></td></tr>')
				save_setting()
				re_watcher_listener(market)
			});

		}

	});

});
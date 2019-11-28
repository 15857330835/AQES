//i am kmh0228   QQ 1150123276
/*
			var select=new SelectBox(obj,data,fn,opts);//寤虹珛 select妗嗗璞�
			鍙傛暟璇存槑  obj : jquery瀵硅薄
					data : 涓嬫媺妗嗛噷鐨勬暟鎹�(鏁版嵁)锛屾暟缁勯噷鍙互鏄€硷紝涔熷彲浠ユ槸json锛屽鏋滄槸json鏈夊搴旂殑dataName鍜宒ataId
					fn  :  鍥炴帀鍑芥暟 鍙傛暟涓� {name:name,id:id}//name鏄緭鍏ユ鍐呭  id鏄殣钘弙alue
					opts:  {},璁剧疆鍙傛暟
						dataName:'name',//option鐨刪tml
						dataId:'id',//option鐨剉alue						
						fontSize:'14',//瀛椾綋澶у皬
						optionFontSize:'14',//涓嬫媺妗嗗瓧浣撳ぇ灏�
						textIndent:4,//瀛椾綋缂╄繘						
						color:'#000',//杈撳叆妗嗗瓧浣撻鑹�
						optionColor:'#000',//涓嬫媺妗嗗瓧浣撻鑹�
						arrowColor:'green',//绠ご棰滆壊
						backgroundColor:'#ccc',//鑳屾櫙鑹查鑹�
						borderColor:'green',//杈圭嚎棰滆壊
						hoverColor:'green',//涓嬫媺妗咹OVER棰滆壊						
						borderWidth:1,//杈圭嚎瀹藉害
						arrowBorderWidth:0,//绠ご宸︿晶鍒嗗壊绾垮搴︺€傚鏋滀负0鍒欎笉鏄剧ず
						borderRadius:5,//杈圭嚎鍦嗚						
						placeholder:'璇疯緭鍏ユ枃瀛�',//榛樿鎻愮ず
						defalut:'firstData',//榛樿鏄剧ず鍐呭銆傚鏋滄槸'firstData',鍒欓粯璁ゆ樉绀虹涓€涓�
						retur:false,//鏄惁闃绘鍦ㄥ缓绔嬫暟鎹悗璋冪敤鍥炴帀鍑芥暟
						allowInput:true,//鏄惁鍏佽杈撳叆						
						width:130,//瀹�
						height:26,//楂�
						optionMaxHeight:500//涓嬫媺妗嗘渶澶ч珮搴�
						
			鏂规硶  changeList(data,opts) 鏀瑰彉鏁版嵁,data涓烘暟鎹紝opts涓哄弬鏁皗retur:false;//鏄惁闃绘鍦ㄥ缓绔嬫暟鎹悗璋冪敤鍥炴帀鍑芥暟}
				changeFnBack(fn)  鏀瑰彉鍥炴帀鍑芥暟
				getResult()       鑾峰彇褰撳墠閫夋嫨椤�	
				close()           闅愯棌涓嬫媺妗�
				setValue(name)		璁剧疆妗嗗唴鐨勫€�
*/

function SelectBox(b, c, d, e) {
	var b = this.obj = b;
	var c = this.data = c || [];
	var e = this.opts = e || {};
	var f = this.dataName = e.dataName || 'name';
	var g = this.dataId = e.dataId || 'id';
	var h = this.fontSize = e.fontSize || '14';
	var i = e.optionFontSize || '14';
	var j = this.textIndent = e.textIndent || 4;
	var k = this.color = e.color || '#000';
	var l = e.optionColor || '#000';
	var m = e.arrowColor || '#5c5c5c';
	var n = e.borderColor || '#c2c2c2';
	var o = this.hoverColor = e.hoverColor || '#6fc';
	var p = e.backgroundColor || '#fff';
	var q = this.placeholder = e.placeholder || '';
	var r = this.defalut = e.defalut || '';
	var s = this.width = e.width || 130;
	var t = this.height = e.height || 26;
	var u = e.optionMaxHeight || 350;
	var v = this.borderWidth = e.borderWidth || 1;
	var w = e.borderRadius || 0;
	var x = typeof e.arrowBorderWidth == 'undefined' ? v : e.arrowBorderWidth;
	var y = this.allowInput = typeof e.allowInput == 'undefined' ? true : e.allowInput;
	this.fnBack = d;
	var z = this;
	this.fn = function(a) {
		z.result = a;
		this.fnBack && this.fnBack(a)
	};
	b.html('<input type="text" value="' + r + '" placeholder="' + q + '"/>				<div class="overlay"></div>				<i><em></em></i>				<ul>				</ul>');
	var A = this.ul = b.find('ul');
	var B = this.input = b.find('input');
	var C = this.retur = e.retur || false;
	this.changeList(c, {
		retur: C
	});
	var D = b.css('position') == 'static' ? 'relative' : b.css('position');
	b.css({
		'width': s,
		'height': t,
		'position': D,
		'border': v + 'px solid ' + n,
		'border-radius': w + 'px',
		'background': p
	});
	b.find('*').css({
		'margin': 0,
		'padding': 0
	});
	B.css({
		'color': k,
		'width': '100%',
		'height': '100%',
		'font-size': h + 'px',
		'text-indent': j + 'px',
		'border': 'none',
		'background': 'none',
        'position':'absolute',
        'top':0,
		'outline': 'none'
	});
	var E = b.find('.overlay');
	E.css({
		'position': 'absolute',
		'top': 0,
		'right': 0,
		'width': '100%',
		'height': '0'
	});
	b.find('i').css({
		'width': t,
		'height': '100%',
		'position': 'absolute',
		'top': 0,
		'right': 0,
		'border-left': x + 'px solid ' + n,
		'cursor': 'pointer'
	});
	var F = parseInt(t / 4);
	var G = parseInt(t * 3 / 8);
	b.find('i em').css({
		'display': 'block',
		'width': '0px',
		'border': F + 'px solid transparent',
		'border-top': F + 'px solid ' + m,
		'margin': G + 'px auto'
	});
	b.find('ul').css({
		'position': 'absolute',
		'color': l,
		'font-size': i + 'px',
		'width': '100%',
		'left': -v,
		'top': t + v,
		'border-left': v + 'px solid ' + n,
		'border-right': v + 'px solid ' + n,
		'border-bottom': v + 'px solid ' + n,
		'background': p,
		'z-index': 999,
		'display': 'none',
		'max-height': u + 'px',
		'overflow-Y': 'auto',
		'border-radius': w + 'px'
	});
	if (!y) {
		B.on('focus', function() {
			B.blur()
		});
		E.css({
			'cursor': 'pointer',
			'height': '100%'
		});
		E.on('click', function() {
			A.toggle()
		})
	}
	this.addEvent()
}
SelectBox.prototype.addEvent = function() {
	var k = this.ul;
	var l = this.input;
	var m = this.obj;
	var o = this;
	k.on('click', 'li', function() {
		k.hide();
		var a = $(this).html();
		var b = $(this).attr('index_id');
		l.val(a).attr('index_id', b);
		o.fn && o.fn({
			name: a,
			id: b
		})
	});
	m.off('click');
	m.on('click', 'i', function() {
		k.toggle()
	});
	$(document).on('focus', 'input', function() {
		if (!m.has($(this)).length) {
			k.hide()
		}
	});
	$(document).on('click', function(e) {
		var a = e.srcElement || e.target;
		if (!m.has(a).length) {
			k.hide()
		}
	});
	this.allowInput && l.focus(function() {
		k.show();
		var f = $(this);
		var g = f.val().replace(' ', '');
		f.timer = setInterval(function() {
			var c = f.val().replace(' ', '');
			if (c != g) {
				g = c;
				if (c == '') {
					k.children().show();
					o.fn && o.fn({
						name: '',
						id: ''
					});
					return
				} else {
					k.children().hide();
					k.children(':contains(' + g + ')').show();
					var d = false;
					k.find('li').each(function(i, e) {
						var a = e.innerHTML;
						if (a == g) {
							d = true;
							var b = $(e).attr('index_id');
							o.fn && o.fn({
								name: a,
								id: b
							});
							return false
						}
					});
					if (!d) {
						o.fn && o.fn({
							name: g,
							id: 'error'
						})
					}
				}
			}
		}, 30);
		var h = function() {
				clearInterval(f.timer);
				f.off('blur');
				f.off('keydown')
			};
		f.on('blur', h);
		var j = function(a) {
				var b = k.children('li:visible').length;
				switch (a.keyCode) {
				case 40:
					o.n++;
					if (o.n > b) {
						o.n = b
					}
					var n = o.n;
					k.children('li').css('background', 'none');
					k.children('li:visible').eq(n - 1).css('background', o.hoverColor);
					if (n * k.children('li:visible').height() > k.height()) {
						k.scrollTop(n * k.children('li:visible').height() - k.height())
					}
					return false;
					break;
				case 38:
					o.n--;
					if (o.n < 1) {
						o.n = 1
					}
					var n = o.n;
					k.children('li').css('background', 'none');
					k.children('li:visible').eq(n - 1).css('background', o.hoverColor);
					if ((n - 1) * k.children('li:visible').height() < k.scrollTop()) {
						k.scrollTop((n - 1) * k.children('li:visible').height() || 0)
					}
					return false;
					break;
				case 13:
					if (o.n) {
						var c = k.children('li:visible').eq(o.n - 1).attr('index_id');
						var d = k.children('li:visible').eq(o.n - 1).html();
						l.val(d).attr('index_id', c);
						o.fn && o.fn({
							name: d,
							id: c
						})
					}
					f.blur();
					k.hide();
					return false;
					break
				}
			}
		f.on('keydown', j);
		return false
	})
};
SelectBox.prototype.changeList = function(a, b) {
	if (!this.input) return;
	var b = b || {};
	var c = b.retur || false;
	var d = a.length;
	var e = this.ul;
	var f = '';
	if (!d) {
		e.html(f);
		this.input.val('').attr('index_id', '');
		return
	}
	var g = this;
	var h = this.obj;
	var j = this.dataName;
	var k = this.dataId;
	if (a[0].constructor == Object) {
		var l = this.data = a
	} else {
		var m = [];
		for (i = 0; i < d; i++) {
			var n = {};
			n[j] = a[i];
			n[k] = a[i];
			m.push(n)
		}
		var l = this.data = m
	};
	var o = {};
	switch (this.defalut) {
	case '':
		o.name = '';
		o.id = '';
		break;
	case 'firstData':
		o.name = l[0][j];
		o.id = l[0][k];
		break;
	default:
		o.name = this.defalut;
		o.id = '';
		for (i = 0; i < d; i++) {
			if (l[i][j] == this.defalut) {
				o.id = l[i][k];
				break
			}
		}
		break
	}
	this.input.val(o.name).attr('index_id', o.id);
	(!this.retur) && this.fn && this.fn(o);
	this.n = 0;
	for (i = 0; i < d; i++) {
		var p = l[i];
		f += '<li index_id="' + p[k] + '">' + p[j] + '</li>'
	}
	e.html(f);
	e.find('li').css({
		'list-style': 'none',
		'text-indent': this.textIndent + 'px',
		'height': this.height,
		'font-size': this.fontSize,
		'line-height': this.height + 'px',
		'white-space': 'nowrap',
		'cursor': 'pointer',
		'overflow': 'hidden'
	});
	e.find('li').hover(function() {
		$(this).css('background', g.hoverColor).siblings().css('background', 'none');
		g.n = h.find('li:visible').index($(this)) + 1
	}, function() {
		$(this).css('background', 'none')
	})
};
SelectBox.prototype.changeFnBack = function(a) {
	this.fnBack = fnBack
};
SelectBox.prototype.getResult = function() {
	return this.result
};
SelectBox.prototype.close = function() {
	this.ul.hide()
};
SelectBox.prototype.setValue = function(a) {
	var b = this.defalut;
	this.defalut = a;
	this.changeList(this.data);
	this.defalut = b
};
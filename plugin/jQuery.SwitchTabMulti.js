/*
 * 开发者：翁杨东

方法使用场景：多个tab切换上下滚动到对应的内容，滚动自动选中对应tab;

使用注意事项：
1、使用时结构中的class:hd和bd都是默认必须的，不能变。
2、tabBox是默认样式的class;
3、默认样式文件在jQuery.SwitchTabMulti.css文件中；
4、使用时应将header(头部)高度考虑进去，header应该有高度，如果没有header则不影响，js里已将header高度考虑进去。
5、标题文字的第一个li默认有class="on";表示当前选中，页面打开选中第一个，注意不要漏了；
6、display-box-horizontal是display:box的样式，用来定义ul下面li的排列，实际中可以自己定义li的排列方式
*/

/*
 * 例子如下()：


<header style="height:3.125em;">
	<p style="background-color:#EFEFEF;height:3.125em;line-height:3.125em;position:fixed;top:0;width:100%;text-align: center;">头部</p>
</header>
<div class="followBox tabBox">
	<div class="">
		<div class="hd">
			<ul class="display-box-horizontal">
				<li class="on"><a>标题文字1</a></li>
				<li><a>标题文字2</a></li>
				<li><a>标题文字3</a></li>
				<li><a>标题文字4</a></li>
			</ul>
		</div>
	</div>
	<div class="bd">
		<article>
			1、第一个tab对应内容
			<p style="height:200px;">fsdfsd</p>
		</article>
		
		<article>
			2、第二个tab对应内容
			<p style="height:800px;">fsdf</p>
		</article>
		
		<article>
			3、第三个tab对应内容
			<p style="height:2000px;">fsdf</p>
		</article>
		
		<article>
			4、第四个tab对应内容
			<p style="height:800px;">fsdf</p>
		</article>
	</div>
</div>

<script type="text/javascript">
	$(".followBox").SwitchTabMulti({})
</script>

*/
(function($,window,document){
	$.fn.SwitchTabMulti=function(options){
		var defaults={
				SwitchBoxID:'leftTabBox',//整个box的id，如果没有默认为leftTabBox
				FixedBoxClass:'fixed2',//浮动菜单的class,
				FixedBoxParentClass:'fixed-box',//浮动菜单的父元素的class，一般与浮动菜单高度相等，使浮动菜单浮起来的时候原页面保持原有的结构不变
				ScrollSpeed:200,//滚动的时间值/速度，越小越快
				AnimateEasing:'swing'//animate()方法的easing参数的值，默认swing，常用的还有linear
			};
		var opts = $.extend({},defaults,options || {});
		var dclasses={
			SwitchBoxClass:'tabBox',//整个box默认样式的class
			ContentTabClass:'message-list',//每个内容content的公有class
			on:'on',
			click:'clicked'
		}
		return this.each(function(i){
			var $objBox=$(this);
			if(($objBox.attr("id")=='')||($objBox.attr("id")==undefined)){
				$objBox.attr("id",opts.SwitchBoxID);
			}
			//$objBox.addClass(dclasses.SwitchBoxClass);
			$objBox.find(".hd").addClass(opts.FixedBoxClass);
			$objBox.find(".hd").parent().addClass(opts.FixedBoxParentClass);
			$objBox.find(".bd").children().addClass(dclasses.ContentTabClass);
			var id=$objBox.attr("id");
			$objBox.find(".hd ul > li a").each(function(i){
				$(this).attr("href",'#'+id+'-'+i);
				$objBox.find('.bd .'+dclasses.ContentTabClass).eq(i).attr("id",id+'-'+i);

			})
			$objBox.find(".hd ul > li a").click(function(e){
				e.preventDefault();
				var self=$(this);
				$objBox.find('.hd ul > li.'+dclasses.click).removeClass(dclasses.click);
				if(self.parent("li").hasClass(dclasses.on)){
					return false;
				}
				self.parent("li").addClass(dclasses.click);
				if($objBox.find(".bd").outerHeight(true)>=$(window).height()){
					self.parents(".hd").addClass(opts.FixedBoxClass);
				}
				var $target=$(self.attr("href"));
				var headerHeight=$("header").outerHeight(true);
				var targetOffset = $target.offset().top - headerHeight - $objBox.find(".hd").outerHeight(true)+1;
				$objBox.find('.hd ul > li.'+dclasses.on).removeClass(dclasses.on);
				self.parent("li").addClass(dclasses.on);
				$('html, body').animate({"scrollTop": targetOffset}, opts.ScrollSpeed,opts.AnimateEasing ,function(){
					//$objBox.find(".hd ul > li").removeClass("on");
					//self.parent("li").addClass("on");
					$objBox.find('.hd ul > li.'+dclasses.click).removeClass(dclasses.click);
				});
			})
			//滚动到对应位置置顶和选中
			$(document).on("scroll",function(){
				var FixedObjTop=$objBox.find('.'+opts.FixedBoxParentClass).offset().top;
				var ScrollTop=$(document).scrollTop();
				var headerHeight=$("header").outerHeight(true);
				var FixedHeight=$objBox.find(".hd").outerHeight(true);
				var windowHeight=$(window).height();
				var DocumentHeight=$(document).height();
				//按钮跟随
				if(FixedObjTop-ScrollTop<=headerHeight){
					$objBox.find(".hd").addClass(opts.FixedBoxClass);
				}else{
					$objBox.find(".hd").removeClass(opts.FixedBoxClass);
				}
				//滑到对应位置选中，滑动到底部自动选中最后一个
				$objBox.find(".bd ."+dclasses.ContentTabClass).each(function(i,value){
					var listTop=$(this).offset().top;
					var FixedHeight=$objBox.find(".hd").outerHeight(true);
					var eachListHeight=$(this).outerHeight(true);
					if((listTop-FixedHeight-ScrollTop-headerHeight<=0)&&(listTop+eachListHeight-FixedHeight-ScrollTop-headerHeight>=0)){
						var id=$(this).attr("id");
						if(!$objBox.find('.hd ul li a[href="#'+id+'"]').parent("li").hasClass(dclasses.on)){
							//console.log(id);
							if(!$objBox.find('.hd ul li').hasClass(dclasses.click)){
								$objBox.find(".hd ul li."+dclasses.on).removeClass(dclasses.on);
								$objBox.find('.hd ul li a[href="#'+id+'"]').parent("li").addClass(dclasses.on);
							}
						}
		
					}
				})
				if(DocumentHeight-ScrollTop-windowHeight<=0){
					$objBox.find(".hd ul > li."+dclasses.on).removeClass(dclasses.on);
					$objBox.find(".hd ul > li a:last").parent("li").addClass(dclasses.on);
				}
			})
		})
	}
})(jQuery,window,document)
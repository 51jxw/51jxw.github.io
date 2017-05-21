// JavaScript Document
window.onload=function ()
{


}

//便捷功能对象
var fn=
{
	byID:function(id)//id取对象
	{
		var el=document.getElementById(id);return el;
	},
	
	byTag:function(tag)
	{
		var el=document.getElementsByTagName(tag);return el;
	},
	
	byClass:function(cla)
	{
		var el=document.getElementsByClassName(cla);return el;
	}
	
		
}


//-----------------------------------------------------声音提醒对象
var audio=function (pl,lo,vo)
{
	
	this.obj=document.createElement("AUDIO");
	this.obj_s1=document.createElement("SOURCE");
	this.obj_s3=document.createElement("SOURCE");
	this.obj.innerHTML="您的浏览器等级太低，不支持音乐播放器，建议更换其他浏览器";
	
	this.pl=pl;
	this.lo=lo;
	this.vo=arguments[2]?arguments[2]:0.5;
}	

audio.prototype.play=function(name)
{
			
	this.src_mp3="mp3/"+name+".mp3";
	this.src_wav="mp3/"+name+".wav";
			
	this.obj_s1.setAttribute("src",this.src_mp3);
	this.obj_s1.setAttribute("type","audio/mpeg");
	
	this.obj_s3.setAttribute("src",this.src_wav);
	this.obj_s3.setAttribute("type","audio/wav");
			
	this.obj.appendChild(this.obj_s1);
	this.obj.appendChild(this.obj_s3);
			
	this.obj.autoplay=this.pl;
	this.obj.volume=this.vo;
	this.obj.loop=this.lo;
	this.obj.play();
}	

audio.prototype.pause=function()
{
	this.obj.pause();
}

var sound_complete=new audio(true,false,0.8);//新建声音对象a1
var background_music=new audio(true,true,0.8);//新建背景音乐对象a2


//----------------------------------------------标题动态提醒对象
var isusing = false;
var newMessageRemind=
{
    _step: 0,
    _title: document.title,
    _timer: null,
    //显示新消息提示
    show:function(){
        var temps = newMessageRemind._title.replace("【　　　】", "").replace("【新消息】", "");
        newMessageRemind._timer = setTimeout(function() {
             newMessageRemind.show();
             newMessageRemind._step++;
                  if (newMessageRemind._step == 3) { newMessageRemind._step = 1 };
                  if (newMessageRemind._step == 1) { document.title = "【　　　】" + "时钟完成" };
                  if (newMessageRemind._step == 2) { document.title = "【番茄熟了】" + "时钟完成" };
             }, 800);
              return [newMessageRemind._timer, newMessageRemind._title];
        },
        //取消新消息提示
            clear: function(){
                clearTimeout(newMessageRemind._timer );
                document.title = newMessageRemind._title;
                }
            };
            
        function newMessage()
		{
             if(!isusing)
			 {
                isusing = true;
                newMessageRemind.show();
             }
        }
            
        document.onclick=function()
		{

             isusing = false;
             newMessageRemind.clear();
					
                
};


/*--------------------------------------------------番茄时钟对象

属性：
1、总时间time
2、有展示时间的div的id
3、动态进度条
4、开始按钮

方法：
1、开始倒计时的start方法
2、提醒remind方法

*/
var tomato=function (show_id,start_bt_id,pb_id,time,rest)
{
	
	this.el=fn.byID(show_id);//展示时间的div
	this.start_bt=fn.byID(start_bt_id);//开始按钮
	this.progress_bar=fn.byID(pb_id);//动态进度条
	this.time=time;//一段时间
	this.i=0;
	this.m=0;
	this.s=0;
	this.t;
	this.total_s=60;
	this.rest=rest;
	this.breakoff=false;
	
}

	
//-------------------------------------------------------番茄时钟对象倒计时方法
tomato.prototype.start=function ()
{	
	
	//背景音乐播放
	if(this.if_rest==false)
	{	
		todo.p_bgm();
	}
	
	
	
	//取消当前番茄时钟
	if(this.breakoff==true)
	{
		clearTimeout(this.t);
		this.el.innerHTML="00:00";
		this.start_bt.disabled=false;
		this.start_bt.innerHTML="开始新的番茄";
		this.progress_bar.style.width=0;
		this.i=0;
		this.m=0;
		todo.breakoff=false;
		todo_rest.breakoff=false;
		background_music.pause();
		background_music=null;
		return;
	
	}
	(this.if_rest==false)?this.start_bt.innerHTML="正在执行":this.start_bt.innerHTML="休息中";
	this.start_bt.disabled="disabled";
	
	if(this.if_rest==false&&localStorage.getItem("time")!=null&&this.i<=0){this.time=localStorage.getItem("time")};
	if(this.if_rest==true&&localStorage.getItem("restTime")!=null&&this.i<=0){this.time=localStorage.getItem("restTime")};
	//用户自定义设置的番茄时钟长度
	this.i++;
				
	this.s=this.i%60;//计算秒数
	
	if(this.total_s-this.s==59){this.m++};//分钟递增
	
	if(this.time-this.m<10){var showm="0"+(this.time-this.m)}else {showm=(this.time-this.m)};
	//防止分出现个位数，剩余时间<10时前面加0；
	if(this.total_s-this.s<10){var shows="0"+(this.total_s-this.s)}else {shows=(this.total_s-this.s)};//防止秒出现个位数
	
	if(this.s==0){shows="00"};//防止出现60s
	this.el.innerHTML=(showm)+":"+(shows);//输出时间到显示div
	//alert(this.if_rest);
	if(this.if_rest==true)
	{
		document.title="休息中"+(showm)+":"+(shows)}else{document.title="工作中"+(showm)+":"+(shows);
		
	}
	this.progress_bar.style.width=240-this.i*1000/(this.time*60000)*240+"px"; //计算进度条的宽度
	var that=this;
	this.t=window.setTimeout(function (){that.start()},1000);//重复循环
	
	//alert(this.m);	
	if(this.time-this.m<0)//剩余时间为零，不能为等于，因为秒数不为零
	{//时间到后执行的提醒
		//localStorage.i=0;
		
		this.el.innerHTML="00:00";
		newMessage();
		clearTimeout(this.t);
		this.start_bt.disabled=false;
		this.start_bt.innerHTML="开始新的专注";
		this.i=0;
		this.m=0;
		background_music.pause();
		background_music=null;
		this.remind();
			
	}		
			
}

//-------------------------------------------------------番茄时钟工作和休息判断方法
tomato.prototype.if_rest=function(if_rest)//
{		
		this.if_rest=if_rest;
		return this.if_rest;
}
//-------------------------------------------------------------------番茄时钟是否播放背景音乐


	
//-------------------------------------------------------------------番茄时钟对象提醒方法
tomato.prototype.remind=function ()
{	
	var that=this;
	/*if(this.if_rest==false)
	{	
		var music_name="女声";
		if(localStorage.getItem("warningTone")!=null)
		{
			music_name=localStorage.getItem("warningTone");
		};
		sound_complete.play(music_name);
		
	}*/
	if(this.if_rest==false)
	{
		var i=0;
		this.t=function()
		{
			i++;
			todo.p_wt()
			if(i>=6){clearInterval(stl)};
		}
		var stl=window.setInterval(that.t,1000);
	
	};
	
	navigator.vibrate([3000, 2000, 1000,2000,1000,2000,1000]);	//手机振动
	
	document.title="您完成了一个番茄";
	
	var t=setTimeout(function (){ a_m.showTime()/*alert("您完成了一个"+that.time+"分钟番茄时钟额……");*/},1000);
	
	document.title="开始休息额";
	if(this.if_rest==false){todo_rest.start();};
}

//
tomato.prototype.p_bgm=function()
{		
		
		var music_name="轻音乐";
		if(localStorage.getItem("background_music")!=null)
		{
			music_name=localStorage.getItem("background_music");
		};
		if(background_music==null)
		{	
			background_music=new audio(true,true,0.8);
			background_music.play(music_name);	
			
		}else
		{	
			background_music.play(music_name);	
		}	
}

tomato.prototype.p_wt=function()
{
	var music_name="女声";
	if(localStorage.getItem("warningTone")!=null)
	{
		music_name=localStorage.getItem("warningTone");
	};

		sound_complete.play(music_name);	
	
}

//------------------------------------------------------------------新建番茄时钟对象		
var todo=new tomato("tomato","start","progress_bar",25);//工作时钟


todo.if_rest(false);




var todo_rest=new tomato("tomato","start","progress_bar",5);//休息时钟
todo_rest.if_rest(true);



/*//提醒用户谨慎操作
document.body.onbeforeunload = function()
{
	window.event.returnValue = '当前任务正在进行,确定退出吗?';
}*/



//___________________________________________________窗口对象
/*
属性
1、选择窗口对象
2、触发按钮

方法
1、显示和隐藏


*/
var win=function (id,bt_id){
	
	this.win_obj=fn.byID(id);//显示隐藏主体
	this.bt=fn.byID(bt_id);//控制按钮
	

	}
	
win.prototype.show_hidden=function ()//控制显示隐藏
{	var that=this;
/*	alert(that.win_obj);
	alert(that.win_obj.getAttribute("display"));*/
	this.bt.addEventListener("click",sh);
	function sh()
	{	
		
		if(that.win_obj.style.display=="block")
		{
			that.win_obj.style.display="none";	
		}else
		{
			that.win_obj.style.display="block";
		}
	}
}	

win.prototype.tab=function (tab_class,tab_tag,tab_body_class,tab_body_tag)//选项卡功能
{	
	var nav=fn.byClass(tab_class)[0];
	var nav_list=nav.getElementsByTagName(tab_tag);
	//alert(nav_list.length);
	var tab_body=fn.byClass(tab_body_class)[0];
	var tab_body_list=tab_body.getElementsByTagName(tab_body_tag);
	//alert(tab_body_list.length);
	for(var i=0;i<nav_list.length;i++)
	{
		nav_list[i].index=i;
		nav_list[i].onclick=function(e)
		{	
			for(var j=0;j<tab_body_list.length;j++)
			{
				tab_body_list[j].style.display="none";
				nav_list[j].className="";
			}
			tab_body_list[this.index].style.display="block";
			
			this.className="tab_select";
			e.stopPropagation();
				
		}
		
	}
}	


var win_bottom= new win("alert_window","menu");
	
win_bottom.show_hidden();	

win_bottom.tab("set_menu","li","set_list","ul");
	
	//document.getElementById("alert_window").getAttribute("display");
	
	
	
//-----------------------------------用户设置番茄钟属性对象

var s_t=fn.byID("s_t");//设置番茄钟长度

s_t.onchange=function()
{
	
	localStorage.setItem("time",s_t.value);	
	
	
}

var s_r_t=fn.byID("s_r_t");//设置休息时间

s_r_t.onblur=function()
{

	localStorage.setItem("restTime",s_r_t.value);
	//alert(localStorage.getItem(restTime));	
	
}

var c_t=fn.byID("close_tomato");//关闭当前番茄

c_t.onclick=function ()
{	
	
	if(confirm("确定终止当前番茄吗"))
	{
		todo.breakoff=true;
		todo_rest.breakoff=true;
	}
	
}

var w_t=fn.byID("w_t");//设置提示音

w_t.onchange=function()
{
	
	localStorage.setItem("warningTone",w_t.value);	
	sound_complete.pause();
	sound_complete=null;
	sound_complete=new audio(true,true,0.8);
	
}

var b_m=fn.byID("b_m");//设置背景音乐

b_m.onchange=function()
{
	
	localStorage.setItem("background_music",b_m.value);
	background_music.pause();
	background_music=null;	
	background_music=new audio(true,true,1);
	//todo.p_bgm();
}


//提示信息
var alert_message=function()
{

	this.bg=fn.byClass("remind_alert")[0];
	this.con=fn.byClass("remind_content")[0];	
	
}

alert_message.prototype.showTime=function()
{	
	this.bg.style.display="block";
	this.con.style.display="block";
	
	this.dis=function tonone()
	{
		that.bg.style.display="none";
		that.con.style.display="none";
		
	}
	
	var that=this;
	
	this.t=setTimeout(that.dis,12000);
		
}

var a_m=new alert_message();

/*var set_tomato=function (set_id,set_item,set_value)
{
    this.set=fn.byID(set_id);//设置的项目
	this.set_item=set_item;
	this.set_value=set_value;
}

set_tomato.prototype.to_set=function(action)
{
	var that=this;
	this.set.action=function()
	{
	
		
	localStorage.setItem(that.set_item,that.set.that.set_value);	
		
	}
	
}

var set_time=new set_tomato("s_t","time","value");
set_time.to_set("onchange");*/

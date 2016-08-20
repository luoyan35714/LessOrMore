---
layout: post
title:  时间同步问题解决方案
date:   2015-11-12 19:49:00 +0800
categories: 杂乱
tag: 时间同步
---


Rdate解决Linux与Linux之间同步
===============================

+ 安装xinetd服务

{% highlight bash %}
$ yum install xinetd
{% endhighlight %}

+ 修改vi /etc/xinetd.d/time-stream文件disable为no

{% highlight bash %}
$ chkconfig xinetd on
{% endhighlight %}

+ 同步时间-p为显示的意思，-s为修改

{% highlight bash %}
$ rdate -ps [服务器IP]
{% endhighlight %}

ntp解决Linux与linux之间，linux与windows之间，windows与windows之间同步问题,
===============================

> ntp的必要条件就是联网，或者存在ntp局域网私服

windows 同步
-------------------------------

![01_windows_time](/images/blog/timesync/01_windows_time.png)

![02_windows_setting.png](/images/blog/timesync/02_windows_setting.png)

![03_windows_server_time.png](/images/blog/timesync/03_windows_server_time.png)

> 将ntp服务器地址写入并点击立即更新，即可与服务器同步

Linux安装ntp服务
-------------------------------

+ 确认ntp已经安装

{% highlight bash %}
[root@localhost bin]# rpm -qf /usr/sbin/ntpd
ntp-4.2.6p5-1.el6.centos.x86_64
{% endhighlight %}

+ 如果未安装则使用

{% highlight bash %}
$ wget http://www.eecis.udel.edu/~ntp/ntp_spool/ntp4/ntp-4.2/ntp-4.2.6p3.tar.gz
$ tar zxf ntp-4.2.6p3.tar.gz
$ mkdir /app/ntp
$ cd ntp-4.2.6p3
$ ./configure --prefix=/app/ntp --enable-all-clocks --enable-parse-clocks
$ make clean && make check && make && make intall
{% endhighlight %}

+ 修改配置文件/etc/ntp.conf

{% highlight bash %}
$ vi /etc/ntp.conf
{% endhighlight %}

> restrict default kod nomodify notrap nopeer noquery

修改为
> restrict default kod nomodify notrap nopeer或者restrict [ip-ip] kod nomodify notrap nopeer

+ 修改上层时间服务器 在/etc/ntp.conf中添加

{% highlight text %}
server 0.centos.pool.ntp.org iburst
server 1.centos.pool.ntp.org iburst
server 2.centos.pool.ntp.org iburst
server 3.centos.pool.ntp.org iburst
{% endhighlight %}

或

{% highlight text %}
server 0.cn.pool.ntp.org iburst
server 0.asia.pool.ntp.org iburst
server 2.asia.pool.ntp.org iburst
{% endhighlight %}

+ 启动NTP服务器,并设置为开机自启动

{% highlight text %}
$ service ntpd start
$ chkconfig ntpd on
{% endhighlight %}

+ 客户端同步
	
在客户端执行ntpdate <ServerIP>

{% highlight text %}
[root@localhost bin]# ntpdate 10.1.5.123
15 Dec 20:07:16 ntpdate[25996]: adjust time server 10.1.5.123 offset -0.011437 dec
{% endhighlight %}

> 在执行此步骤时会出现错误：the NTP socket is in use, exiting
> 这是因为ntpd服务和ntpdate不可以在同一台机器同时执行
> 如果出现no server suitable for synchronization found错误，则等待几分钟就可以了。

+ 配置CronTab来定时执行同步命令

{% highlight text %}
$ vi /etc/crontab
* * * * * [username] ntpdate [server_ip]
{% endhighlight %}

示例(每天凌晨一点更新):

{% highlight text %}
$ crontab –u [username] file
* 1 * * * ntpdate 10.1.5.120 >> ~/install-files/log/ntpdate.log
{% endhighlight %}

+ 重启crond服务

{% highlight text %}
$ service crond restart
{% endhighlight %}


<br />
<br />

参考资料：
-------------------------------------

鸟哥的私房菜 ：[http://linux.vbird.org/linux_server/0440ntp.php](http://linux.vbird.org/linux_server/0440ntp.php)

Linux系统时间同步 : [http://blog.chinaunix.net/uid-20672257-id-3013282.html](http://blog.chinaunix.net/uid-20672257-id-3013282.html)

Rdate时间同步 : [http://blog.csdn.net/wyzxg/article/details/5568475](http://blog.csdn.net/wyzxg/article/details/5568475)

Rdate时间同步 : [http://blog.csdn.net/eliuyanmin/article/details/4461874](http://blog.csdn.net/eliuyanmin/article/details/4461874)

Windows和Linux做时间同步方法 : [http://blog.csdn.net/ablo_zhou/article/details/5658916](http://blog.csdn.net/ablo_zhou/article/details/5658916)

<br />
<br />
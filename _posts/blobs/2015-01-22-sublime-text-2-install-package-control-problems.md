---
layout: post
title:  sublime text2解决中文乱码问题曲折路--安装package control代理问题
date:   2015-01-22 0:35:00 +0800
categories: 杂乱
tag: 解决问题
---

package control安装问题解决
----------------------------------

* 当sublime text2安装package control的时候，起初用网上的([http://www.ituring.com.cn/article/6815](http://www.ituring.com.cn/article/6815))

{% highlight python %}
import urllib2,os;pf='Package Control.sublime-package';ipp=sublime.installed_packages_path();os.makedirs(ipp) if not os.path.exists(ipp) else None;open(os.path.join(ipp,pf),'wb').write(urllib2.urlopen('http://sublime.wbond.net/'+pf.replace(' ','%20')).read());
{% endhighlight %}

* 结果报错如下
![install_package_control_proxy_problem](/images/blog/blobs/sublime_text2_package_control_problems/1_install_package_control_proxy_problem.png)

* 发现python的网络读取出错，怀疑是代理的原因
* 分析Python代码发现以上代码只是做了一件事情`从网上下载了一个文件写入了一个路径`
* 于是把文件下载下来,地址：[https://sublime.wbond.net/Package%20Control.sublime-package](https://sublime.wbond.net/Package%20Control.sublime-package)
* 在Ctrl+`之后在里面输入
* Print sublime.installed_packages_path();
* 拿到打印输出的package安装路径`C:\Users\admin\AppData\Roaming\Sublime Text 2\Installed Packages`
* 将下载的文件拷贝进入上述路径，然后重启sublime就可以了

install package代理问题解决
----------------------------------

* 然后在Preference-》Package Control-》 Install Package中又一次遇到问题

![2_install_packages_pop_problems](/images/blog/blobs/sublime_text2_package_control_problems/2_install_packages_pop_problems.png)

* 没办法，Ctrl+`调出Sublime的控制台查看错误日志，发现依旧是代理问题

![3_install_packages_pop_problems_log](/images/blog/blobs/sublime_text2_package_control_problems/3_install_packages_pop_problems_log.png)

* 查阅文档[https://github.com/wbond/package_control/issues/123](https://github.com/wbond/package_control/issues/123),官方的一个Issue提交，解决办法是找一个网页，结果打开的时候发现过期了，将代理地址等等全写好，依旧不管用

![4_proxy_configuration](/images/blog/blobs/sublime_text2_package_control_problems/4_proxy_configuration.png)

* 然后仔细查看控制台输出之后，决定把chanel.json文件放在本地,浏览器输入[https://sublime.wbond.net/channel.json](https://sublime.wbond.net/channel.json)果然能拿到，果断切IE，下载保存。`Preference-》Package Settings -> Package Control-> Setting-Default`

![5_download_chanel_json_setting](/images/blog/blobs/sublime_text2_package_control_problems/5_download_chanel_json_setting.png)

* 找到Channel所在位置，改为

![6_download_chanel_json_location](/images/blog/blobs/sublime_text2_package_control_problems/6_download_chanel_json_location.png)

* 重启Sublime, 恩~好用了，哈哈
![7_package_control_open](/images/blog/blobs/sublime_text2_package_control_problems/7_package_control_open.png)

安装ConvertToUTF8又一次遇到问题
-----------------------------------------

* 安装ConvertToUTF8，又一次遇到问题，不用问，肯定是代理。

![8_convert_to_utf8_problem](/images/blog/blobs/sublime_text2_package_control_problems/8_convert_to_utf8_problem.png)

* 失去信心了。直接打开Channel.json搜索ConvertToUTF8找到下载站点如下。

![9_convert_to_utf8_download_site](/images/blog/blobs/sublime_text2_package_control_problems/9_convert_to_utf8_download_site.png)

* [https://codeload.github.com/seanliang/ConvertToUTF8/zip/1.2.8](https://codeload.github.com/seanliang/ConvertToUTF8/zip/1.2.8), 下载下来内容

* Preference->Browse Packages 打开包管理路径直接将下载的解压到此地。

* 重启Sublime，终于中文乱码一去不复返了。

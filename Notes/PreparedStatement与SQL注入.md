##### 什么是SQL注入

> 所谓SQL注入，就是通过把SQL命令插入到Web表单或输入域名或页面请求的查询字符串中，最终欺骗服务器执行的恶意的SQL命令。

##### 举个简单的栗子

现在实现一个登陆功能，前台俩输入框，用户名和密码，后台获取到前台传来的用户名和密码后构建一条查询用户的sql语句：

```java
String sql = "select count(*) as count from user where username = " + username " and password = " + password;
```

通过运行上面的sql语句，可以根据count是否大于0来判断用户是否可以正常登陆。

当然，这对于正常的登陆没有问题，但怕就怕不正常的情况。

假如，用户的密码是这样的`''or '1'='1'`，那么这种情况下最终拼装出来的sql语句就是下面这条：

```sql
select count(*) as count from user where username = 'name' and password = '' or '1' = '1';
```

这种情况下 sql语句返回的执行结果始终大于0，也就是说，可以通过这样的方式实现任意登录。之所以会出现这样的情况，是因为用户的输入中包含一些sql语句中特殊的单词或符号，而且后台把用户输入的东西在数据库执行了。

##### 解决方法

我了解到的解决方法有下面三种：

* 对用户的输入进行过滤，转义敏感字符
* 使用存储过程，即sql语句都写在存储过程中，后天只是调用存储过程
* 使用PreparedStatement代替Statement

第一条：对用户的输入进行过滤，转义敏感字符

​	前台可以对用户的输入进行检测，如果出现像`select/update/delete/>/`等sql关键字或操作符就提示为非法输入。

第二条：使用存储过程（这一条不说了，因为我暂时还没了解这么多）

第三条：使用PreparedStatement代替Statement

用PreparedStatement来是实现上面的登陆：

```java
Connection conn = DriverManger.getConnection("jdbc:mysql://ip:port/jdbc","name","password");
String sql =  "select count(*) as count from user where username = ? and password = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, username);
ps.setString(2, password);
```

以上就是通过PreparedStatement实现登陆功能的伪代码。

用户输入内容相同的情况下，使用PreparedStatement打印出来的sql语句如下：

```sql
select count(*) as count from user where username = 'name' and password ='\'\' or \'1\'=\'1\'';
```

可以看到单引号被转义了，用户没法截断原来的字符串，所以也就没法sql注入，而且用户输入的密码完整的被当做了一个参数。

##### 为什么使用PreparedStatement可以防止SQL注入

一个sql是经过解析器编译然后才执行。在使用Statement时，sql拼接完后才会进行编译然后执行，例如上面那句sql：

```sql
select count(*) as count from user where username = 'name' and password = '' or '1 = 1';
```

这时候包括参数在内都会被编译然后执行，所以传入的参数中如果包含sql关键字或语句，就有可能出现sql注入。

使用PreparedStatement时，语句中的参数位置使用 ? 占位，在创建PreparedStatement对象时，sql语句就已经被编译，当所需要的参数传进来时语句就会直接执行。也就是说，预编译之后，数据库就不会重复编译了，这个时候再传什么and、or等关键字都只会当成普通字符串来处理，所以，即使用户传了能够引起sql注入的语句，也只会被当做参数，不会去运行。

究其原因就是PreparedStatement多了预编译的过程。
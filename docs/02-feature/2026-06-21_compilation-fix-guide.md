# 编译问题解决方案

## 问题描述

在命令行使用 Maven 编译时遇到 Lombok 注解处理器问题，导致编译失败：

```
找不到符号: 方法 setCount(long)
找不到符号: 方法 setPageNo(int)
找不到符号: 方法 setLists(java.util.List<T>)
找不到符号: 方法 getOss()
找不到符号: 变量 log
```

这是 Lombok 的 `@Data` 和 `@Slf4j` 注解没有生成相应的方法和变量。

## 根本原因

项目在 IntelliJ IDEA 中可以正常编译运行，因为 IDEA 配置了 Lombok 插件和注解处理器。但在命令行使用 Maven 编译时，Lombok 注解处理器可能没有正确配置或版本不兼容。

## ✅ 解决方案（推荐）

### 方案 1: 在 IntelliJ IDEA 中重新编译

**这是最简单快速的方法：**

1. **打开 IntelliJ IDEA**
   - 打开项目 `/Users/baitao/project/bty/btyadmin`

2. **检查 Lombok 配置**
   - `Settings` → `Plugins` → 确认已安装 `Lombok`
   - `Settings` → `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
   - 勾选 `Enable annotation processing`
   - 确认 `Obtain processors from project classpath` 被选中

3. **重新构建项目**
   - `Build` → `Rebuild Project`
   - 等待构建完成

4. **运行服务**
   - 找到 `BTYAdminApplication.java`
   - 右键 → `Run 'BTYAdminApplication'`

### 方案 2: 修复 Maven Lombok 配置

如果需要在命令行编译，需要修改 pom.xml：

#### 步骤 1: 确认父 POM 中的 Lombok 配置

检查 `/Users/baitao/project/bty/btyadmin/pom.xml`：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.22</version>
</dependency>
```

#### 步骤 2: 添加 Maven 编译器插件配置

在 `bty-common/pom.xml` 中添加：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>9</source>
                <target>9</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>1.18.22</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

#### 步骤 3: 清理并重新编译

```bash
cd /Users/baitao/project/bty/btyadmin
mvn clean compile
```

### 方案 3: 使用 IDEA 的 Maven 工具

1. **打开 Maven 工具窗口**
   - View → Tool Windows → Maven

2. **执行编译**
   - 展开 btyadmin-java → Lifecycle
   - 双击 `compile`

3. **查看输出**
   - 在底部控制台查看编译结果

## 🎯 推荐：直接在 IDEA 中操作

由于项目之前可以在 IDEA 中正常运行，最简单的方法是：

1. **在 IDEA 中重新构建**
   - Build → Rebuild Project

2. **运行服务**
   - Run 'BTYAdminApplication'

3. **测试抠图功能**
   - 在小程序中上传图片
   - 点击抠图按钮
   - 查看日志输出

## 验证编译成功

编译成功后，应该能看到：

```
BUILD SUCCESS
```

然后检查生成的类文件：

```bash
ls -la bty-admin/target/classes/com/bty/admin/service/viapi/
```

应该能看到：

```
ViapiService.class
```

## 启动服务后验证

启动服务后，查看日志应该包含：

```
✅ OSS 客户端初始化成功，endpoint: oss-cn-shenzhen.aliyuncs.com, bucket: bty-admin
✅ 视觉智能服务初始化成功
```

## 常见问题

### Q1: IDEA 中 Lombok 不生效

**解决：**
1. File → Settings → Plugins → 搜索 "Lombok" → Install
2. 重启 IDEA
3. Build → Rebuild Project

### Q2: 找不到 log 变量

**原因：** `@Slf4j` 注解没有生效

**解决：**
1. 确认 Lombok 插件已安装
2. 确认注解处理器已启用
3. Rebuild Project

### Q3: 找不到 getter/setter 方法

**原因：** `@Data` 注解没有生效

**解决：** 同上，启用注解处理器

## 下一步

编译成功后：

1. ✅ 启动服务
2. ✅ 测试图片上传到 OSS
3. ✅ 测试抠图功能
4. ✅ 验证抠图结果

---

**总结：项目可以在 IDEA 中正常编译和运行，推荐直接在 IDEA 中操作，避免命令行 Maven 的 Lombok 配置问题。**

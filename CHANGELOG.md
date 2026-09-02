# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.0] - 2026-09-02

### Added

- 待办事项的添加、完成/取消完成、删除功能
- 批量清除已完成项
- 每条待办显示任务名称与状态标签（进行中 / 已完成）
- 完成后文字删除线 + 浅绿背景 + 绿色状态标识
- 未完成项自动置顶、已完成项沉底的智能排序
- 顶部剩余待办数、底部总数与完成数实时统计
- 空状态引导提示
- localStorage 本地持久化，刷新/关闭浏览器数据不丢失
- 响应式布局，桌面端与移动端自适应
- 无障碍支持：语义化 HTML、aria-label、键盘可操作、焦点可见
- MIT 许可证

### Tech

- 纯 HTML5 + CSS3 + 原生 JavaScript（ES6+），零依赖、零构建
- CSS 变量设计系统，Inter 字体，内联 SVG 图标

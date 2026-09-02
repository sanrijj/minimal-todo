/**
 * 极简待办应用
 * 纯原生 JS，数据持久化到 localStorage
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'todo_list_items_v1';

    // ===== DOM 引用 =====
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const counter = document.getElementById('counter');
    const summary = document.getElementById('summary');
    const clearCompletedBtn = document.getElementById('btn-clear-completed');

    // ===== 状态 =====
    /** @type {{id: string, text: string, completed: boolean, createdAt: number}[]} */
    let todos = [];

    // ===== 工具函数 =====
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function loadTodos() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(
                (item) =>
                    item &&
                    typeof item.id === 'string' &&
                    typeof item.text === 'string' &&
                    typeof item.completed === 'boolean'
            );
        } catch (err) {
            console.warn('读取待办数据失败，已重置为空列表。', err);
            return [];
        }
    }

    function saveTodos() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (err) {
            console.warn('保存待办数据失败。', err);
        }
    }

    // ===== 渲染 =====
    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.dataset.id = todo.id;

        // 复选框
        const label = document.createElement('label');
        label.className = 'todo-checkbox';
        label.setAttribute('aria-label', todo.completed ? '标记为未完成' : '标记为已完成');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const visual = document.createElement('span');
        visual.className = 'checkbox-visual';
        visual.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';

        label.appendChild(checkbox);
        label.appendChild(visual);

        // 内容区
        const content = document.createElement('div');
        content.className = 'todo-content';

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const status = document.createElement('span');
        status.className = 'todo-status';
        status.innerHTML =
            '<span class="dot" aria-hidden="true"></span>' +
            (todo.completed ? '已完成' : '进行中');

        content.appendChild(text);
        content.appendChild(status);

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', '删除该待办');
        deleteBtn.innerHTML =
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(label);
        li.appendChild(content);
        li.appendChild(deleteBtn);

        return li;
    }

    function render() {
        list.innerHTML = '';

        if (todos.length === 0) {
            emptyState.hidden = false;
        } else {
            emptyState.hidden = true;
            // 未完成在前，已完成在后；同组内按创建时间倒序
            const sorted = [...todos].sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                return b.createdAt - a.createdAt;
            });
            const fragment = document.createDocumentFragment();
            sorted.forEach((todo) => fragment.appendChild(createTodoElement(todo)));
            list.appendChild(fragment);
        }

        updateStats();
    }

    function updateStats() {
        const total = todos.length;
        const completed = todos.filter((t) => t.completed).length;
        const remaining = total - completed;

        counter.textContent = `共 ${total} 项 · 已完成 ${completed} 项`;

        if (total === 0) {
            summary.textContent = '今天也要加油呀';
        } else if (remaining === 0) {
            summary.textContent = '全部完成，太棒了！';
        } else {
            summary.textContent = `还有 ${remaining} 项待完成`;
        }

        clearCompletedBtn.hidden = completed === 0;
    }

    // ===== 操作 =====
    function addTodo(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        todos.push({
            id: generateId(),
            text: trimmed,
            completed: false,
            createdAt: Date.now(),
        });
        saveTodos();
        render();
    }

    function toggleTodo(id) {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }

    function deleteTodo(id) {
        const el = list.querySelector(`[data-id="${id}"]`);
        if (el) {
            el.classList.add('removing');
            setTimeout(() => {
                todos = todos.filter((t) => t.id !== id);
                saveTodos();
                render();
            }, 180);
        } else {
            todos = todos.filter((t) => t.id !== id);
            saveTodos();
            render();
        }
    }

    function clearCompleted() {
        todos = todos.filter((t) => !t.completed);
        saveTodos();
        render();
    }

    // ===== 事件绑定 =====
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
        input.focus();
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);

    // ===== 初始化 =====
    todos = loadTodos();
    render();
    input.focus();
})();
